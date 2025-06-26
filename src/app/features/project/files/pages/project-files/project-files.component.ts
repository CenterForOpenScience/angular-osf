import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { TreeDragDropService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

import { debounceTime, filter, finalize, Observable, skip, take } from 'rxjs';

import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CreateFolderDialogComponent } from '@osf/features/project/files/components';
import { FilesTreeActions } from '@osf/features/project/files/models';
import {
  CreateFolder,
  DeleteEntry,
  GetFiles,
  GetRootFolderFiles,
  ProjectFilesSelectors,
  RenameEntry,
  SetCurrentFolder,
  SetFilesIsLoading,
  SetMoveFileCurrentFolder,
  SetSearch,
  SetSort,
} from '@osf/features/project/files/store';
import { approveFile } from '@osf/features/project/files/utils';
import { ALL_SORT_OPTIONS } from '@osf/shared/constants';
import {
  FilesTreeComponent,
  FormSelectComponent,
  LoadingSpinnerComponent,
  SearchInputComponent,
  SubHeaderComponent,
} from '@shared/components';
import { OsfFile } from '@shared/models';
import { FilesService } from '@shared/services';

@Component({
  selector: 'osf-project-files',
  imports: [
    TableModule,
    Button,
    FloatLabel,
    SubHeaderComponent,
    SearchInputComponent,
    Select,
    LoadingSpinnerComponent,
    Dialog,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    FilesTreeComponent,
    FormSelectComponent,
  ],
  templateUrl: './project-files.component.html',
  styleUrl: './project-files.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, TreeDragDropService],
})
export class ProjectFilesComponent {
  @HostBinding('class') classes = 'flex flex-column flex-1 w-full h-full';

  private readonly filesService = inject(FilesService);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly actions = createDispatchMap({
    createFolder: CreateFolder,
    deleteEntry: DeleteEntry,
    getFiles: GetFiles,
    getRootFolderFiles: GetRootFolderFiles,
    renameEntry: RenameEntry,
    setCurrentFolder: SetCurrentFolder,
    setFilesIsLoading: SetFilesIsLoading,
    setMoveFileCurrentFolder: SetMoveFileCurrentFolder,
    setSearch: SetSearch,
    setSort: SetSort,
  });

  protected readonly files = select(ProjectFilesSelectors.getFiles);
  protected readonly isFilesLoading = select(ProjectFilesSelectors.isFilesLoading);
  protected readonly currentFolder = select(ProjectFilesSelectors.getCurrentFolder);
  protected readonly provider = select(ProjectFilesSelectors.getProvider);

  protected readonly projectId = signal<string>('');
  protected readonly progress = signal(0);
  protected readonly fileName = signal('');
  protected readonly searchControl = new FormControl<string>('');
  protected readonly sortControl = new FormControl(ALL_SORT_OPTIONS[0].value);

  fileIsUploading = signal(false);
  isFolderOpening = signal(false);

  sortOptions = ALL_SORT_OPTIONS;

  protected readonly filesTreeActions: FilesTreeActions = {
    setCurrentFolder: (folder) => this.actions.setCurrentFolder(folder),
    setSearch: (search) => this.actions.setSearch(search),
    setSort: (sort) => this.actions.setSort(sort),
    setFilesIsLoading: (isLoading) => this.actions.setFilesIsLoading(isLoading),
    getFiles: (filesLink) => this.actions.getFiles(filesLink),
    getRootFolderFiles: (projectId) => this.actions.getRootFolderFiles(projectId),
    deleteEntry: (projectId, link) => this.actions.deleteEntry(projectId, link),
    renameEntry: (projectId, link, newName) => this.actions.renameEntry(projectId, link, newName),
    setMoveFileCurrentFolder: (folder) => this.actions.setMoveFileCurrentFolder(folder),
  };

  constructor() {
    this.activeRoute.parent?.parent?.parent?.params.subscribe((params) => {
      if (params['id']) {
        this.projectId.set(params['id']);
        this.actions.getRootFolderFiles(params['id']);
      }
    });

    this.searchControl.valueChanges
      .pipe(skip(1), takeUntilDestroyed(this.destroyRef), debounceTime(500))
      .subscribe((searchText) => {
        this.actions.setSearch(searchText ?? '');
        if (!this.isFolderOpening()) {
          this.updateFilesList();
        }
      });

    this.sortControl.valueChanges.pipe(skip(1), takeUntilDestroyed(this.destroyRef)).subscribe((sort) => {
      this.actions.setSort(sort ?? '');
      if (!this.isFolderOpening()) {
        this.updateFilesList();
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.fileName.set(file.name);
    this.fileIsUploading.set(true);
    this.filesService
      .uploadFile(file, this.projectId(), this.provider(), this.currentFolder())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.fileName.set('');
          input.value = '';
          this.updateFilesList().subscribe(() => this.fileIsUploading.set(false));
        })
      )
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress.set(Math.round((event.loaded / event.total) * 100));
        }

        if (event.type === HttpEventType.Response) {
          if (event.body) {
            const fileId = event?.body?.data.id;
            approveFile(fileId, this.projectId());
          }
        }
      });
  }

  createFolder(): void {
    this.dialogService
      .open(CreateFolderDialogComponent, {
        width: '448px',
        focusOnShow: false,
        header: this.translateService.instant('project.files.dialogs.createFolder.title'),
        closeOnEscape: true,
        modal: true,
        closable: true,
      })
      .onClose.pipe(filter((folderName: string) => !!folderName))
      .subscribe((folderName) => {
        this.actions
          .createFolder(
            this.projectId(),
            folderName,
            this.currentFolder()?.relationships?.parentFolderId ? this.currentFolder()!.id : ''
          )
          .pipe(
            take(1),
            finalize(() => {
              this.updateFilesList().subscribe(() => this.fileIsUploading.set(false));
            })
          )
          .subscribe();
      });
  }

  downloadFolder(): void {
    const projectId = this.projectId();
    const folderId = this.currentFolder()?.id ?? '';
    const isRootFolder = !this.currentFolder()?.relationships?.parentFolderLink;

    if (projectId && folderId) {
      if (isRootFolder) {
        const link = this.filesService.getFolderDownloadLink(projectId, this.provider(), '', true);
        window.open(link, '_blank')?.focus();
      } else {
        const link = this.filesService.getFolderDownloadLink(projectId, this.provider(), folderId, false);
        window.open(link, '_blank')?.focus();
      }
    }
  }

  updateFilesList(): Observable<void> {
    const currentFolder = this.currentFolder();
    if (currentFolder?.relationships.filesLink) {
      return this.actions.getFiles(currentFolder?.relationships.filesLink).pipe(takeUntilDestroyed(this.destroyRef));
    } else {
      return this.actions.getRootFolderFiles(this.projectId());
    }
  }

  folderIsOpening(value: boolean): void {
    this.isFolderOpening.set(value);
    if (value) {
      this.searchControl.setValue('');
      this.sortControl.setValue(ALL_SORT_OPTIONS[0].value);
    }
  }

  navigateToFile(file: OsfFile) {
    this.router.navigate([file.guid], { relativeTo: this.activeRoute });
  }
}
