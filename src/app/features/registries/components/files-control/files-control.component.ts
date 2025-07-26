import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { TreeDragDropService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';

import { EMPTY, filter, finalize, Observable, shareReplay, take } from 'rxjs';

import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CreateFolderDialogComponent } from '@osf/features/project/files/components';
import { approveFile } from '@osf/features/project/files/utils';
import { FilesTreeComponent, LoadingSpinnerComponent } from '@osf/shared/components';
import { FilesTreeActions, OsfFile } from '@osf/shared/models';
import { FilesService } from '@osf/shared/services';

import {
  CreateFolder,
  GetFiles,
  GetRootFolders,
  RegistriesSelectors,
  SetCurrentFolder,
  SetFilesIsLoading,
  SetMoveFileCurrentFolder,
} from '../../store';

@Component({
  selector: 'osf-files-control',
  imports: [
    FilesTreeComponent,
    Button,
    LoadingSpinnerComponent,
    Dialog,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './files-control.component.html',
  styleUrl: './files-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, TreeDragDropService],
})
export class FilesControlComponent {
  attachedFiles = input.required<Partial<OsfFile>[]>();
  attachFile = output<OsfFile>();
  filesLink = input.required<string>();
  projectId = input.required<string>();
  provider = input.required<string>();

  private readonly filesService = inject(FilesService);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly files = select(RegistriesSelectors.getFiles);
  protected readonly isFilesLoading = select(RegistriesSelectors.isFilesLoading);
  protected readonly currentFolder = select(RegistriesSelectors.getCurrentFolder);

  protected readonly progress = signal(0);
  protected readonly fileName = signal('');
  protected readonly dataLoaded = signal(false);

  fileIsUploading = signal(false);
  isFolderOpening = signal(false);

  private readonly actions = createDispatchMap({
    createFolder: CreateFolder,
    getFiles: GetFiles,
    setFilesIsLoading: SetFilesIsLoading,
    setCurrentFolder: SetCurrentFolder,
    getRootFolders: GetRootFolders,
    setMoveFileCurrentFolder: SetMoveFileCurrentFolder,
  });

  protected readonly filesTreeActions: FilesTreeActions = {
    setCurrentFolder: (folder) => this.actions.setCurrentFolder(folder),
    setFilesIsLoading: (isLoading) => this.actions.setFilesIsLoading(isLoading),
    getFiles: (filesLink) => this.actions.getFiles(filesLink),
    setMoveFileCurrentFolder: (folder) => this.actions.setMoveFileCurrentFolder(folder),
  };

  constructor() {
    effect(() => {
      // const filesLink = this.draftRegistration()?.branchedFrom?.filesLink;
      const filesLink = this.filesLink();
      if (filesLink) {
        this.actions
          .getRootFolders(filesLink)
          .pipe(shareReplay(), takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.dataLoaded.set(true);
          });
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadFile(file);
  }

  createFolder(): void {
    const currentFolder = this.currentFolder();
    const newFolderLink = currentFolder?.links.newFolder;

    if (!newFolderLink) return;

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
          .createFolder(newFolderLink, folderName)
          .pipe(
            take(1),
            finalize(() => {
              this.updateFilesList().subscribe(() => this.fileIsUploading.set(false));
            })
          )
          .subscribe();
      });
  }

  updateFilesList(): Observable<void> {
    const currentFolder = this.currentFolder();
    if (currentFolder?.relationships.filesLink) {
      this.filesTreeActions.setFilesIsLoading?.(true);
      return this.actions.getFiles(currentFolder?.relationships.filesLink).pipe(take(1));
    }

    return EMPTY;
  }

  uploadFile(file: File): void {
    const currentFolder = this.currentFolder();
    const uploadLink = currentFolder?.links.upload;
    if (!uploadLink) return;

    this.fileName.set(file.name);
    this.fileIsUploading.set(true);

    this.filesService
      .uploadFile(file, uploadLink)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.fileIsUploading.set(false);
          this.fileName.set('');
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
            const branchedFromId = this.projectId();
            if (fileId && branchedFromId) {
              approveFile(fileId, branchedFromId);
            }
          }
        }
      });
  }

  selectFile(file: OsfFile): void {
    this.attachFile.emit(file);
  }

  folderIsOpening(value: boolean): void {
    this.isFolderOpening.set(value);
  }
}
