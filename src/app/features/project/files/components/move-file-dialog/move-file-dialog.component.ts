import { select, Store } from '@ngxs/store';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Tooltip } from 'primeng/tooltip';

import { finalize } from 'rxjs';

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { OsfFile } from '@osf/features/project/files/models';
import { ProjectFilesService } from '@osf/features/project/files/services/project-files.service';
import {
  GetFiles,
  GetMoveFileFiles,
  GetRootFolderFiles,
  SetCurrentFolder,
  SetFilesIsLoading,
  SetMoveFileCurrentFolder,
} from '@osf/features/project/files/store/project-files.actions';
import { ProjectFilesSelectors } from '@osf/features/project/files/store/project-files.selectors';
import { LoadingSpinnerComponent } from '@shared/components';

@Component({
  selector: 'osf-move-file-dialog',
  imports: [Button, LoadingSpinnerComponent, NgOptimizedImage, Tooltip],
  templateUrl: './move-file-dialog.component.html',
  styleUrl: './move-file-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveFileDialogComponent {
  store = inject(Store);
  dialogRef = inject(DynamicDialogRef);
  projectFilesService = inject(ProjectFilesService);
  config = inject(DynamicDialogConfig);

  protected readonly files = select(ProjectFilesSelectors.getMoveFileFiles);
  protected readonly currentFolder = select(ProjectFilesSelectors.getMoveFileCurrentFolder);
  protected readonly isFilesUpdating = signal(false);
  protected readonly isFolderSame = computed(() => {
    return this.currentFolder()?.id === this.config.data.file.relationships.parentFolderId;
  });

  constructor() {
    const filesLink = this.currentFolder()?.relationships.filesLink;
    if (filesLink) {
      this.store.dispatch(new GetMoveFileFiles(filesLink));
    }
  }

  openFolder(file: OsfFile) {
    if (file.kind !== 'folder') return;

    this.store.dispatch(new GetMoveFileFiles(file.relationships.filesLink));
    this.store.dispatch(new SetMoveFileCurrentFolder(file));
  }

  openParentFolder() {
    const currentFolder = this.currentFolder();

    if (!currentFolder) return;

    this.isFilesUpdating.set(true);
    this.projectFilesService
      .getFolder(currentFolder.relationships.parentFolderLink)
      .pipe(
        finalize(() => {
          this.isFilesUpdating.set(false);
        })
      )
      .subscribe((folder) => {
        this.store.dispatch(new SetMoveFileCurrentFolder(folder));
        this.store.dispatch(new GetMoveFileFiles(folder.relationships.filesLink));
      });
  }

  moveFile(): void {
    let path = this.currentFolder()?.path;
    console.log(this.currentFolder());

    if (!path) {
      throw new Error('Path is not specified!.');
    }

    if (!this.currentFolder()?.relationships.parentFolderLink) {
      path = '/';
    }

    this.store.dispatch(new SetFilesIsLoading(true));
    this.projectFilesService
      .moveFile(this.config.data.file.links.move, path, this.config.data.projectId, this.config.data.action)
      .pipe(
        finalize(() => {
          this.store.dispatch(new SetCurrentFolder(this.currentFolder()));
          this.store.dispatch(new SetMoveFileCurrentFolder(undefined));
        })
      )
      .subscribe((file) => {
        if (file.id) {
          const filesLink = this.currentFolder()?.relationships.filesLink;
          console.log(this.currentFolder());
          if (filesLink) {
            this.store.dispatch(new GetFiles(filesLink));
          } else {
            this.store.dispatch(new GetRootFolderFiles(this.config.data.projectId));
          }
        }
      });
    this.dialogRef.close();
  }
}
