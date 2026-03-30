import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { TreeDragDropService } from 'primeng/api';
import { Button } from 'primeng/button';

import { filter, finalize, switchMap, take } from 'rxjs';

import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { CreateFolderDialogComponent } from '@osf/features/files/components';
import { FileUploadDialogComponent } from '@osf/shared/components/file-upload-dialog/file-upload-dialog.component';
import { FilesTreeComponent } from '@osf/shared/components/files-tree/files-tree.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { FILE_SIZE_LIMIT } from '@osf/shared/constants/files-limits.const';
import { ClearFileDirective } from '@osf/shared/directives/clear-file.directive';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { FilesService } from '@osf/shared/services/files.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { FileModel } from '@shared/models/files/file.model';
import { FileFolderModel } from '@shared/models/files/file-folder.model';

import {
  CreateFolder,
  GetFiles,
  GetRootFolders,
  RegistriesSelectors,
  SetFilesIsLoading,
  SetRegistriesCurrentFolder,
} from '../../store';

@Component({
  selector: 'osf-files-control',
  imports: [
    Button,
    FilesTreeComponent,
    LoadingSpinnerComponent,
    FileUploadDialogComponent,
    TranslatePipe,
    ClearFileDirective,
  ],
  templateUrl: './files-control.component.html',
  styleUrl: './files-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TreeDragDropService],
})
export class FilesControlComponent {
  attachedFiles = input.required<Partial<FileModel>[]>();
  filesLink = input.required<string>();
  projectId = input.required<string>();
  provider = input.required<string>();
  filesViewOnly = input<boolean>(false);
  attachFile = output<FileModel>();

  private readonly filesService = inject(FilesService);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  readonly files = select(RegistriesSelectors.getFiles);
  readonly filesTotalCount = select(RegistriesSelectors.getFilesTotalCount);
  readonly isFilesLoading = select(RegistriesSelectors.isFilesLoading);
  readonly currentFolder = select(RegistriesSelectors.getCurrentFolder);

  readonly progress = signal(0);
  readonly fileName = signal('');
  readonly dataLoaded = signal(false);

  fileIsUploading = signal(false);
  filesSelection: FileModel[] = [];

  private readonly actions = createDispatchMap({
    createFolder: CreateFolder,
    getFiles: GetFiles,
    setFilesIsLoading: SetFilesIsLoading,
    setCurrentFolder: SetRegistriesCurrentFolder,
    getRootFolders: GetRootFolders,
  });

  constructor() {
    this.setupRootFoldersLoader();
    this.setupCurrentFolderWatcher();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (file.size >= FILE_SIZE_LIMIT) {
      this.toastService.showWarn('shared.files.limitText');
      return;
    }

    this.uploadFiles(file);
  }

  createFolder(): void {
    const newFolderLink = this.currentFolder()?.links.newFolder;
    if (!newFolderLink) return;

    this.customDialogService
      .open(CreateFolderDialogComponent, {
        header: 'files.dialogs.createFolder.title',
        width: '448px',
      })
      .onClose.pipe(
        filter((folderName: string) => !!folderName),
        switchMap((folderName) => this.actions.createFolder(newFolderLink, folderName)),
        finalize(() => this.fileIsUploading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.refreshFilesList());
  }

  uploadFiles(files: File | File[]): void {
    const file = Array.isArray(files) ? files[0] : files;
    const uploadLink = this.currentFolder()?.links.upload;
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
          this.refreshFilesList();
        })
      )
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress.set(Math.round((event.loaded / event.total) * 100));
        }

        if (event.type === HttpEventType.Response && event.body) {
          const fileId = event.body.data?.id?.split('/').pop();

          if (fileId) {
            this.filesService
              .getFileGuid(fileId)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe((uploadedFile) => this.selectFile(uploadedFile));
          }
        }
      });
  }

  selectFile(file: FileModel): void {
    if (this.filesViewOnly()) return;
    this.attachFile.emit(file);
  }

  onFileTreeSelected(file: FileModel): void {
    this.filesSelection.push(file);
    this.filesSelection = [...new Set(this.filesSelection)];
  }

  onLoadFiles(event: { link: string; page: number }) {
    this.actions.getFiles(event.link, event.page);
  }

  setCurrentFolder(folder: FileFolderModel) {
    this.actions.setCurrentFolder(folder);
  }

  private setupRootFoldersLoader() {
    toObservable(this.filesLink)
      .pipe(
        filter((link) => !!link),
        take(1),
        switchMap((link) => this.actions.getRootFolders(link)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.dataLoaded.set(true));
  }

  private setupCurrentFolderWatcher() {
    toObservable(this.currentFolder)
      .pipe(
        filter((folder) => !!folder),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.refreshFilesList());
  }

  private refreshFilesList(): void {
    const filesLink = this.currentFolder()?.links.filesLink;
    if (!filesLink) return;

    this.actions.setFilesIsLoading(true);
    this.actions.getFiles(filesLink, 1);
  }
}
