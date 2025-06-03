import { select, Store } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Menu } from 'primeng/menu';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

import { debounceTime, filter, finalize, forkJoin, skip } from 'rxjs';

import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostBinding,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MoveFileDialogComponent } from '@osf/features/project/files/components';
import { FileMenuItems, OsfFile } from '@osf/features/project/files/models';
import { ProjectFilesService } from '@osf/features/project/files/services';
import {
  CreateFolder,
  DeleteEntry,
  GetFiles,
  GetRootFolderFiles,
  ProjectFilesSelectors,
  RenameEntry,
  SetCurrentFolder,
  SetMoveFileCurrentFolder,
  SetSearch,
  SetSort,
} from '@osf/features/project/files/store';
import { LoadingSpinnerComponent, SearchInputComponent, SubHeaderComponent } from '@shared/components';
import { FileSizePipe } from '@shared/pipes';

import { FILE_MENU_ITEMS, FILE_SORT_OPTIONS } from './constants';

@Component({
  selector: 'osf-project-files',
  imports: [
    TableModule,
    Button,
    DatePipe,
    FloatLabel,
    SubHeaderComponent,
    SearchInputComponent,
    Select,
    LoadingSpinnerComponent,
    Dialog,
    InputText,
    FormsModule,
    ReactiveFormsModule,
    Menu,
    TranslatePipe,
    RouterLink,
    FileSizePipe,
  ],
  templateUrl: './project-files.component.html',
  styleUrl: './project-files.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class ProjectFilesComponent {
  @HostBinding('class') classes = 'flex flex-column flex-1 w-full h-full';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  readonly store = inject(Store);
  readonly projectFilesService = inject(ProjectFilesService);
  readonly router = inject(Router);
  readonly activeRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  protected readonly files = select(ProjectFilesSelectors.getFiles);
  protected readonly currentFolder = select(ProjectFilesSelectors.getCurrentFolder);

  protected readonly projectId = signal<string>('');
  protected readonly progress = signal(0);
  protected readonly fileName = signal('');
  protected readonly isFilesUpdating = signal<boolean>(false);
  protected readonly searchControl = new FormControl<string>('');
  protected readonly sortControl = new FormControl(FILE_SORT_OPTIONS[0].value);
  protected readonly folderForm = new FormGroup<{
    name: FormControl<string>;
  }>({
    name: new FormControl('', { nonNullable: true }),
  });
  protected readonly renameForm = new FormGroup<{
    name: FormControl<string>;
  }>({
    name: new FormControl('', { nonNullable: true }),
  });

  dialogRef: DynamicDialogRef | null = null;
  readonly #dialogService = inject(DialogService);

  fileIsUploading = false;
  isFolderCreating = false;
  selectedFileIndex = -1;

  createFolderVisible = false;
  renameFileVisible = false;

  items = FILE_MENU_ITEMS;
  sortOptions = FILE_SORT_OPTIONS;

  readonly isBatching = signal(false);

  protected readonly FileMenuItems = FileMenuItems;

  constructor() {
    this.activeRoute.parent?.params.subscribe((params) => {
      if (params['id']) {
        this.projectId.set(params['id']);
        this.store.dispatch(new GetRootFolderFiles(params['id']));
      }
    });

    this.searchControl.valueChanges
      .pipe(
        skip(1),
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500),
        filter(() => !this.isBatching())
      )
      .subscribe((searchText) => {
        this.store.dispatch(new SetSearch(searchText ?? ''));
        this.updateFilesList();
      });

    this.sortControl.valueChanges
      .pipe(
        skip(1),
        takeUntilDestroyed(this.destroyRef),
        filter(() => !this.isBatching())
      )
      .subscribe((sort) => {
        this.store.dispatch(new SetSort(sort ?? ''));
        this.updateFilesList();
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.fileName.set(file.name);
    this.fileIsUploading = true;
    this.projectFilesService
      .uploadFile(file, this.projectId(), this.currentFolder())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.fileIsUploading = false;
          this.fileName.set('');
          input.value = '';
          this.updateFilesList();
        })
      )
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress.set(Math.round((event.loaded / event.total) * 100));
        }

        if (event.type === HttpEventType.Response) {
          if (event.body) {
            const fileId = event?.body?.data.id;
            this.approveFile(fileId);
          }
        }
      });
  }

  openFolder(file: OsfFile) {
    if (file.kind !== 'folder') return;
    this.isFilesUpdating.set(true);
    this.isBatching.set(true);

    forkJoin([
      this.store.dispatch(new SetCurrentFolder(file)),
      this.store.dispatch(new SetSearch('')),
      this.store.dispatch(new SetSort(FILE_SORT_OPTIONS[0].value)),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.searchControl.setValue('');
        this.sortControl.setValue(FILE_SORT_OPTIONS[0].value);
        this.isBatching.set(false);
        this.updateFilesList();
      });
  }

  openParentFolder() {
    const currentFolder = this.currentFolder();

    if (!currentFolder) return;

    this.isFilesUpdating.set(true);
    this.isBatching.set(true);

    this.projectFilesService.getFolder(currentFolder.relationships.parentFolderLink).subscribe((folder) => {
      forkJoin([
        this.store.dispatch(new SetCurrentFolder(folder)),
        this.store.dispatch(new SetSearch('')),
        this.store.dispatch(new SetSort(FILE_SORT_OPTIONS[0].value)),
      ])
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.searchControl.setValue('');
          this.sortControl.setValue(FILE_SORT_OPTIONS[0].value);
          this.isBatching.set(false);
          this.updateFilesList();
        });
    });
  }

  createFolder(): void {
    this.isFolderCreating = true;
    const folderName = this.folderForm.getRawValue().name;
    if (folderName.trim()) {
      this.store
        .dispatch(new CreateFolder(this.projectId(), folderName, this.currentFolder()?.relationships?.parentFolderId))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.createFolderVisible = false;
          this.isFolderCreating = false;
          this.folderForm.reset();
        });
    }
  }

  deleteEntry(link: string): void {
    this.isFilesUpdating.set(true);
    this.store
      .dispatch(new DeleteEntry(this.projectId(), link))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isFilesUpdating.set(false);
      });
  }

  renameEntry(): void {
    this.renameFileVisible = false;
    this.isFilesUpdating.set(true);
    const link = this.files().data[this.selectedFileIndex].links.upload;
    const newName = this.renameForm.getRawValue().name;
    if (newName.trim()) {
      this.store
        .dispatch(new RenameEntry(this.projectId(), link, newName))
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => {
            this.isFilesUpdating.set(false);
            this.selectedFileIndex = -1;
            this.renameForm.reset();
          })
        )
        .subscribe();
    }
  }

  downloadFile(link: string): void {
    window.open(link, '_blank')?.focus();
  }

  downloadFolder(folderId: string, rootFolder: boolean): void {
    const projectId = this.projectId();
    if (projectId && folderId) {
      if (rootFolder) {
        const link = this.projectFilesService.getFolderDownloadLink(projectId, '', true);
        window.open(link, '_blank')?.focus();
      } else {
        const link = this.projectFilesService.getFolderDownloadLink(projectId, folderId, false);
        window.open(link, '_blank')?.focus();
      }
    }
  }

  approveFile(fileId: string): void {
    const projectId = this.projectId();
    const link = `https://staging4.osf.io/api/v1/${projectId}/files/${fileId}/`;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = link;

    // Optionally clean up the iframe after it's done
    iframe.onload = () => {
      setTimeout(() => iframe.remove(), 3000); // wait just in case redirects
    };

    document.body.appendChild(iframe);
  }

  moveFile(file: OsfFile, action: string): void {
    this.store
      .dispatch(new SetMoveFileCurrentFolder(this.currentFolder()))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const header = action === 'move' ? 'Move file' : 'Copy file';
        this.dialogRef = this.#dialogService.open(MoveFileDialogComponent, {
          width: '552px',
          focusOnShow: false,
          header: header,
          closeOnEscape: true,
          modal: true,
          closable: true,
          data: {
            file: file,
            projectId: this.projectId(),
            action: action,
          },
        });
      });
  }

  updateFilesList(): void {
    const currentFolder = this.currentFolder();
    if (currentFolder?.relationships.filesLink) {
      this.store
        .dispatch(new GetFiles(currentFolder?.relationships.filesLink))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.isFilesUpdating.set(false);
        });
    } else {
      this.store.dispatch(new GetRootFolderFiles(this.projectId()));
    }
  }
}
