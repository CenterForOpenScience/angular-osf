import { createDispatchMap, select, Store } from '@ngxs/store';

import { TranslateModule } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Tooltip } from 'primeng/tooltip';

import { finalize, take } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OsfFile } from '@osf/features/project/files/models';
import { ProjectFilesService } from '@osf/features/project/files/services';
import {
  GetFiles,
  GetMoveFileFiles,
  GetRootFolderFiles,
  ProjectFilesSelectors,
  SetCurrentFolder,
  SetFilesIsLoading,
  SetMoveFileCurrentFolder,
} from '@osf/features/project/files/store';
import { LoadingSpinnerComponent } from '@shared/components';

@Component({
  selector: 'osf-move-file-dialog',
  imports: [Button, LoadingSpinnerComponent, NgOptimizedImage, Tooltip, TranslateModule],
  templateUrl: './move-file-dialog.component.html',
  styleUrl: './move-file-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveFileDialogComponent {
  store = inject(Store);
  dialogRef = inject(DynamicDialogRef);
  projectFilesService = inject(ProjectFilesService);
  config = inject(DynamicDialogConfig);
  destroyRef = inject(DestroyRef);

  protected readonly files = select(ProjectFilesSelectors.getMoveFileFiles);
  protected readonly currentFolder = select(ProjectFilesSelectors.getMoveFileCurrentFolder);
  protected readonly isFilesUpdating = signal(false);
  protected readonly isFolderSame = computed(() => {
    return this.currentFolder()?.id === this.config.data.file.relationships.parentFolderId;
  });

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
    this.projectFilesService
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
      throw new Error('Path is not specified!.');
    }

    if (!this.currentFolder()?.relationships.parentFolderLink) {
      path = '/';
    }

    this.dispatch.setFilesIsLoading(true);
    this.projectFilesService
      .moveFile(this.config.data.file.links.move, path, this.config.data.projectId, this.config.data.action)
      .pipe(
        take(1),
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.dispatch.setCurrentFolder(this.currentFolder());
          this.dispatch.setMoveFileCurrentFolder(undefined);
        })
      )
      .subscribe((file) => {
        if (file.id) {
          const filesLink = this.currentFolder()?.relationships.filesLink;
          if (filesLink) {
            this.dispatch.getFiles(filesLink);
          } else {
            this.dispatch.getRootFolderFiles(this.config.data.projectId);
          }
        }
      });
    this.dialogRef.close();
  }
}
