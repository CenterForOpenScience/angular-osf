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

import { FilesSelectors, GetFiles, GetRootFolderFiles, SetCurrentFolder } from '@osf/features/files/store';
import { FileKind } from '@osf/shared/enums';
import { FileFolderModel, FileLinksModel, FileModel } from '@osf/shared/models';
import { CustomPaginatorComponent, IconComponent, LoadingSpinnerComponent } from '@shared/components';
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

  readonly files = select(FilesSelectors.getFiles);
  readonly filesTotalCount = select(FilesSelectors.getFilesTotalCount);
  readonly isLoading = select(FilesSelectors.isFilesLoading);
  readonly currentFolder = select(FilesSelectors.getCurrentFolder);
  readonly isFilesUpdating = signal(false);
  readonly rootFolders = select(FilesSelectors.getRootFolders);

  readonly storageName =
    this.config.data.storageName || this.translateService.instant('files.dialogs.moveFile.osfStorage');

  readonly provider = select(FilesSelectors.getProvider);

  readonly actions = createDispatchMap({
    getFiles: GetFiles,
    setCurrentFolder: SetCurrentFolder,
    getRootFolderFiles: GetRootFolderFiles,
  });

  foldersStack = signal<FileFolderModel[]>(this.config.data.foldersStack ?? []);
  previousFolder = signal<FileFolderModel | null>(null);

  pageNumber = signal(1);

  itemsPerPage = 10;
  first = 0;

  readonly isFolderSame = computed(() => this.currentFolder()?.id === this.config.data.fileFolderId);

  get isMoveAction() {
    return this.config.data.action === 'move';
  }

  constructor() {
    this.initPreviousFolder();

    effect(() => {
      const page = this.pageNumber();
      const filesLink = this.currentFolder()?.links?.filesLink;

      if (filesLink) {
        this.actions.getFiles(filesLink, page);
      }
    });
  }

  initPreviousFolder() {
    const stack = this.foldersStack();
    if (stack.length === 0) {
      this.previousFolder.set(null);
    } else {
      this.previousFolder.set(stack[stack.length - 1]);
    }
  }

  openFolder(file: FileModel | FileFolderModel) {
    if (file.kind === FileKind.Folder) {
      const current = this.currentFolder();
      if (current) {
        this.previousFolder.set(current);
        this.foldersStack.update((stack) => [...stack, current]);
      }
      const filesLink = (file.links as FileLinksModel).self;
      if (filesLink) {
        this.actions.getFiles(filesLink);
      }
      this.actions.setCurrentFolder(file as FileFolderModel);
    }
  }

  openParentFolder() {
    this.foldersStack.update((stack) => {
      const newStack = [...stack];
      const previous = newStack.pop() ?? null;
      this.previousFolder.set(newStack.length > 0 ? newStack[newStack.length - 1] : null);

      if (previous) {
        this.actions.setCurrentFolder(previous);
        this.actions.getFiles(previous.links.filesLink);
      }
      return newStack;
    });
  }

  moveFile(): void {
    const path = this.currentFolder()?.path;

    if (!path) {
      throw new Error(this.translateService.instant('files.dialogs.moveFile.pathError'));
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
          this.actions.setCurrentFolder(this.currentFolder());
          this.actions.setCurrentFolder(null);
          this.isFilesUpdating.set(false);
          this.dialogRef.close(this.foldersStack());
        }),
        catchError((error) => {
          this.toastService.showError(error.error.message);
          return throwError(() => error);
        })
      )
      .subscribe((file) => {
        if (file.id) {
          const filesLink = this.currentFolder()?.links.filesLink;
          const rootFolders = this.rootFolders();
          this.resetPagination();
          if (filesLink) {
            this.actions.getFiles(filesLink);
          } else if (rootFolders) {
            this.actions.getFiles(rootFolders[0].links.filesLink);
          }
        }
      });
  }

  resetPagination() {
    this.first = 0;
    this.pageNumber.set(1);
  }

  onFilesPageChange(event: PaginatorState): void {
    this.pageNumber.set(event.page! + 1);
    this.first = event.first!;
  }
}
