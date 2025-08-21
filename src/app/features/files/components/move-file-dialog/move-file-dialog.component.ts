import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Tooltip } from 'primeng/tooltip';

import { finalize, take, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  FilesSelectors,
  GetFiles,
  GetMoveFileFiles,
  GetRootFolderFiles,
  SetCurrentFolder,
  SetMoveFileCurrentFolder,
} from '@osf/features/files/store';
import { IconComponent, LoadingSpinnerComponent } from '@shared/components';
import { OsfFile } from '@shared/models';
import { FilesService, ToastService } from '@shared/services';

@Component({
  selector: 'osf-move-file-dialog',
  imports: [Button, LoadingSpinnerComponent, NgOptimizedImage, Tooltip, TranslatePipe, IconComponent],
  templateUrl: './move-file-dialog.component.html',
  styleUrl: './move-file-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveFileDialogComponent {
  readonly config = inject(DynamicDialogConfig);
  readonly dialogRef = inject(DynamicDialogRef);

  private readonly filesService = inject(FilesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);
  private readonly toastService = inject(ToastService);

  protected readonly files = select(FilesSelectors.getMoveFileFiles);
  protected readonly isLoading = select(FilesSelectors.isMoveFileFilesLoading);
  protected readonly currentFolder = select(FilesSelectors.getMoveFileCurrentFolder);
  private readonly rootFolders = select(FilesSelectors.getRootFolders);
  protected readonly isFilesUpdating = signal(false);
  protected readonly isFolderSame = computed(() => {
    return this.currentFolder()?.id === this.config.data.file.relationships.parentFolderId;
  });
  protected readonly provider = select(FilesSelectors.getProvider);

  protected readonly dispatch = createDispatchMap({
    getMoveFileFiles: GetMoveFileFiles,
    setMoveFileCurrentFolder: SetMoveFileCurrentFolder,
    setCurrentFolder: SetCurrentFolder,
    getFiles: GetFiles,
    getRootFolderFiles: GetRootFolderFiles,
  });

  constructor() {
    const filesLink = this.currentFolder()?.relationships.filesLink;
    const rootFolders = this.rootFolders();
    if (filesLink) {
      this.dispatch.getMoveFileFiles(filesLink);
    } else if (rootFolders) {
      this.dispatch.getMoveFileFiles(rootFolders[0].relationships.filesLink);
    }
  }

  openFolder(file: OsfFile) {
    if (file.kind !== 'folder') return;

    this.dispatch.getMoveFileFiles(file.relationships.filesLink);
    this.dispatch.setMoveFileCurrentFolder(file);
  }

  openParentFolder() {
    const currentFolder = this.currentFolder();

    if (!currentFolder) return;

    this.isFilesUpdating.set(true);
    this.filesService
      .getFolder(currentFolder.relationships.parentFolderLink)
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isFilesUpdating.set(false);
        }),
        catchError((error) => {
          this.toastService.showError(error.error.message);
          return throwError(() => error);
        })
      )
      .subscribe((folder) => {
        this.dispatch.setMoveFileCurrentFolder(folder);
        this.dispatch.getMoveFileFiles(folder.relationships.filesLink);
      });
  }

  moveFile(): void {
    let path = this.currentFolder()?.path;

    if (!path) {
      throw new Error(this.translateService.instant('files.dialogs.moveFile.pathError'));
    }

    if (!this.currentFolder()?.relationships.parentFolderLink) {
      path = '/';
    }

    this.isFilesUpdating.set(true);
    this.filesService
      .moveFile(
        this.config.data.file.links.move,
        path,
        this.config.data.resourceId,
        this.provider(),
        this.config.data.action
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.dispatch.setCurrentFolder(this.currentFolder());
          this.dispatch.setMoveFileCurrentFolder(null);
          this.isFilesUpdating.set(false);
          this.dialogRef.close();
        }),
        catchError((error) => {
          this.toastService.showError(error.error.message);
          return throwError(() => error);
        })
      )
      .subscribe((file) => {
        this.dialogRef.close();

        if (file.id) {
          const filesLink = this.currentFolder()?.relationships.filesLink;
          const rootFolders = this.rootFolders();
          if (filesLink) {
            this.dispatch.getFiles(filesLink);
          } else if (rootFolders) {
            this.dispatch.getMoveFileFiles(rootFolders[0].relationships.filesLink);
          }
        }
      });
  }
}
