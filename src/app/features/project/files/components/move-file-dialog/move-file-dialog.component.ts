import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Tooltip } from 'primeng/tooltip';

import { finalize, take } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  GetFiles,
  GetMoveFileFiles,
  GetRootFolderFiles,
  ProjectFilesSelectors,
  SetCurrentFolder,
  SetFilesIsLoading,
  SetMoveFileCurrentFolder,
} from '@osf/features/project/files/store';
import { IconComponent, LoadingSpinnerComponent } from '@shared/components';
import { OsfFile } from '@shared/models';
import { FilesService } from '@shared/services';

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

  protected readonly files = select(ProjectFilesSelectors.getMoveFileFiles);
  protected readonly isLoading = select(ProjectFilesSelectors.isMoveFileFilesLoading);
  protected readonly currentFolder = select(ProjectFilesSelectors.getMoveFileCurrentFolder);
  protected readonly isFilesUpdating = signal(false);
  protected readonly isFolderSame = computed(() => {
    return this.currentFolder()?.id === this.config.data.file.relationships.parentFolderId;
  });
  protected readonly provider = select(ProjectFilesSelectors.getProvider);

  protected readonly dispatch = createDispatchMap({
    getMoveFileFiles: GetMoveFileFiles,
    setMoveFileCurrentFolder: SetMoveFileCurrentFolder,
    setFilesIsLoading: SetFilesIsLoading,
    setCurrentFolder: SetCurrentFolder,
    getFiles: GetFiles,
    getRootFolderFiles: GetRootFolderFiles,
  });

  constructor() {
    const filesLink = this.currentFolder()?.relationships.filesLink;
    if (filesLink) {
      this.dispatch.getMoveFileFiles(filesLink);
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
      throw new Error(this.translateService.instant('project.files.dialogs.moveFile.pathError'));
    }

    if (!this.currentFolder()?.relationships.parentFolderLink) {
      path = '/';
    }

    this.isFilesUpdating.set(true);
    this.filesService
      .moveFile(
        this.config.data.file.links.move,
        path,
        this.config.data.projectId,
        this.provider(),
        this.config.data.action
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.dispatch.setCurrentFolder(this.currentFolder());
          this.dispatch.setMoveFileCurrentFolder(null);
          this.isFilesUpdating.set(false);
        })
      )
      .subscribe((file) => {
        this.dialogRef.close();

        if (file.id) {
          const filesLink = this.currentFolder()?.relationships.filesLink;
          if (filesLink) {
            this.dispatch.getFiles(filesLink);
          } else {
            this.dispatch.getRootFolderFiles(this.config.data.projectId);
          }
        }
      });
  }
}
