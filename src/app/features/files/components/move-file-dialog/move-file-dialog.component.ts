import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ScrollerModule } from 'primeng/scroller';
import { Tooltip } from 'primeng/tooltip';
import { TreeScrollIndexChangeEvent } from 'primeng/tree';

import { finalize, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  FilesSelectors,
  GetMoveDialogFiles,
  SetCurrentFolder,
  SetMoveDialogCurrentFolder,
} from '@osf/features/files/store';
import { FileKind, ResourceType } from '@osf/shared/enums';
import { FilesMapper } from '@osf/shared/mappers/files/files.mapper';
import { FileFolderModel, FileModel } from '@osf/shared/models';
import { CurrentResourceSelectors, GetResourceDetails, GetResourceWithChildren } from '@osf/shared/stores';
import { FileSelectDestinationComponent, IconComponent, LoadingSpinnerComponent } from '@shared/components';
import { FilesService, ToastService } from '@shared/services';

import { FileProvider } from '../../constants';

@Component({
  selector: 'osf-move-file-dialog',
  imports: [
    Button,
    LoadingSpinnerComponent,
    Tooltip,
    TranslatePipe,
    IconComponent,
    ScrollerModule,
    FileSelectDestinationComponent,
  ],
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

  readonly files = select(FilesSelectors.getMoveDialogFiles);
  readonly filesTotalCount = select(FilesSelectors.getMoveDialogFilesTotalCount);
  readonly isLoading = select(FilesSelectors.isMoveDialogFilesLoading);
  readonly currentFolder = select(FilesSelectors.getMoveDialogCurrentFolder);
  readonly isFilesUpdating = signal(false);
  readonly currentProject = select(CurrentResourceSelectors.getCurrentResource);
  readonly components = select(CurrentResourceSelectors.getResourceWithChildren);
  readonly areComponentsLoading = select(CurrentResourceSelectors.isResourceWithChildrenLoading);
  readonly isConfiguredStorageAddonsLoading = select(FilesSelectors.isMoveDialogConfiguredStorageAddonsLoading);
  readonly isRootFoldersLoading = select(FilesSelectors.isMoveDialogRootFoldersLoading);

  readonly provider = select(FilesSelectors.getProvider);

  readonly actions = createDispatchMap({
    getMoveDialogFiles: GetMoveDialogFiles,
    setMoveDialogCurrentFolder: SetMoveDialogCurrentFolder,
    setCurrentFolder: SetCurrentFolder,
    getResourceDetails: GetResourceDetails,
    getComponentsTree: GetResourceWithChildren,
  });

  foldersStack = signal<FileFolderModel[]>(this.config.data.foldersStack ?? []);
  storageProvider = signal<string>(this.config.data.storageProvider ?? FileProvider.OsfStorage);
  previousFolder = signal<FileFolderModel | null>(null);

  isLoadingMore = signal(false);
  itemsPerPage = 10;
  initialFolder = this.config.data.initialFolder;
  private lastFolderId: string | null = null;
  private fileProjectId = this.config.data.resourceId;

  readonly isFolderSame = computed(() => this.currentFolder()?.id === this.initialFolder?.id);

  readonly isDestinationLoading = computed(
    () => this.isConfiguredStorageAddonsLoading() || this.areComponentsLoading() || this.isRootFoldersLoading()
  );

  readonly showFilesLoading = computed(
    () => this.isDestinationLoading() || ((this.isLoading() || this.isFilesUpdating()) && !this.isLoadingMore())
  );

  readonly buttonDisabled = computed(
    () => this.isLoading() || this.isFilesUpdating() || this.isFolderSame() || this.isDestinationLoading()
  );

  get isMoveAction() {
    return this.config.data.action === 'move';
  }

  constructor() {
    this.initPreviousFolder();
    const currentProject = this.currentProject();
    if (currentProject) {
      const rootParentId = currentProject.rootResourceId ?? currentProject.id;
      this.actions.getComponentsTree(rootParentId, currentProject.id, ResourceType.Project);
    }

    effect(() => {
      const folder = this.currentFolder();
      const isLoading = this.isDestinationLoading();

      if (isLoading) return;

      if (!folder || folder.id === this.lastFolderId) return;

      this.lastFolderId = folder.id;
      this.actions.getMoveDialogFiles(folder.links.filesLink, 1);
    });

    effect(() => {
      if (!this.isLoading()) {
        this.isLoadingMore.set(false);
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
      const folder = FilesMapper.mapFileToFolder(file as FileModel);
      this.actions.setMoveDialogCurrentFolder(folder);
    }
  }

  openParentFolder() {
    this.foldersStack.update((stack) => {
      const newStack = [...stack];
      const previous = newStack.pop() ?? null;
      this.previousFolder.set(newStack.length > 0 ? newStack[newStack.length - 1] : null);

      if (previous) {
        this.actions.setMoveDialogCurrentFolder(previous);
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
      .moveFile(this.config.data.file.links.move, path, this.fileProjectId, this.provider(), this.config.data.action)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.actions.setCurrentFolder(this.initialFolder);
          this.actions.setMoveDialogCurrentFolder(null);
          this.isFilesUpdating.set(false);
        }),
        catchError((error) => {
          this.dialogRef.close();
          this.toastService.showError(error.error.message);
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.dialogRef.close({ foldersStack: this.foldersStack(), success: true });
      });
  }

  private loadNextPage(): void {
    const total = this.filesTotalCount();
    const loaded = this.files().length;
    const nextPage = Math.floor(loaded / this.itemsPerPage) + 1;

    if (!this.isLoadingMore() && loaded < total) {
      this.isLoadingMore.set(true);
      this.actions.getMoveDialogFiles(this.currentFolder()?.links.filesLink ?? '', nextPage);
    }
  }

  onScrollIndexChange(event: TreeScrollIndexChangeEvent) {
    const loaded = this.files().length;
    if (event.last >= loaded - 1) {
      this.loadNextPage();
    }
  }

  onProjectChange(projectId: string) {
    this.fileProjectId = projectId;
    this.foldersStack.set([]);
    this.previousFolder.set(null);
  }
}
