import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Tooltip } from 'primeng/tooltip';

import { finalize, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  FilesSelectors,
  GetFiles,
  GetMoveFileFiles,
  GetRootFolderFiles,
  SetCurrentFolder,
  SetMoveFileCurrentFolder,
} from '@osf/features/files/store';
import { CustomPaginatorComponent, IconComponent, LoadingSpinnerComponent } from '@shared/components';
import { OsfFile } from '@shared/models';
import { FilesService, ToastService } from '@shared/services';

@Component({
  selector: 'osf-move-file-dialog',
  imports: [Button, LoadingSpinnerComponent, Tooltip, TranslatePipe, IconComponent, CustomPaginatorComponent],
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

  readonly files = select(FilesSelectors.getMoveFileFiles);
  readonly filesTotalCount = select(FilesSelectors.getMoveFileFilesTotalCount);
  readonly isLoading = select(FilesSelectors.isMoveFileFilesLoading);
  readonly currentFolder = select(FilesSelectors.getMoveFileCurrentFolder);
  readonly isFilesUpdating = signal(false);
  readonly rootFolders = select(FilesSelectors.getRootFolders);

  readonly isFolderSame = computed(() => {
    return this.currentFolder()?.id === this.config.data.file.relationships.parentFolderId;
  });

  readonly storageName =
    this.config.data.storageName || this.translateService.instant('files.dialogs.moveFile.osfStorage');

  readonly provider = select(FilesSelectors.getProvider);

  readonly dispatch = createDispatchMap({
    getMoveFileFiles: GetMoveFileFiles,
    setMoveFileCurrentFolder: SetMoveFileCurrentFolder,
    setCurrentFolder: SetCurrentFolder,
    getFiles: GetFiles,
    getRootFolderFiles: GetRootFolderFiles,
  });

  foldersStack: OsfFile[] = this.config.data.foldersStack ?? [];
  previousFolder: OsfFile | null = null;

  pageNumber = signal(1);

  itemsPerPage = 10;
  first = 0;
  filesLink = '';

  constructor() {
    this.initPreviousFolder();
    const filesLink = this.currentFolder()?.relationships?.filesLink;
    const rootFolders = this.rootFolders();
    this.filesLink = filesLink ?? rootFolders?.[0].relationships?.filesLink ?? '';
    if (this.filesLink) {
      this.dispatch.getMoveFileFiles(this.filesLink, this.pageNumber());
    }

    effect(() => {
      const page = this.pageNumber();
      if (this.filesLink) {
        this.dispatch.getMoveFileFiles(this.filesLink, page);
      }
    });
  }

  initPreviousFolder() {
    const foldersStack = this.foldersStack;
    if (foldersStack.length === 0) {
      this.previousFolder = null;
    } else {
      this.previousFolder = foldersStack[foldersStack.length - 1];
    }
  }

  openFolder(file: OsfFile) {
    if (file.kind !== 'folder') return;
    const current = this.currentFolder();
    if (current) {
      this.previousFolder = current;
      this.foldersStack.push(current);
    }
    this.dispatch.getMoveFileFiles(file.relationships.filesLink);
    this.dispatch.setMoveFileCurrentFolder(file);
  }

  openParentFolder() {
    const previous = this.foldersStack.pop() ?? null;
    this.previousFolder = this.foldersStack.length > 0 ? this.foldersStack[this.foldersStack.length - 1] : null;
    if (previous) {
      this.dispatch.setMoveFileCurrentFolder(previous);
      this.dispatch.getMoveFileFiles(previous.relationships.filesLink);
    }
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

  onFilesPageChange(event: PaginatorState): void {
    this.pageNumber.set(event.page! + 1);
    this.first = event.first!;
  }
}
