import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ScrollerModule } from 'primeng/scroller';
import { Tooltip } from 'primeng/tooltip';
import { TreeScrollIndexChangeEvent } from 'primeng/tree';

import { finalize, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  FilesSelectors,
  GetMoveDialogFiles,
  SetCurrentFolder,
  SetMoveDialogCurrentFolder,
} from '@osf/features/files/store';
import { FileSelectDestinationComponent } from '@osf/shared/components/file-select-destination/file-select-destination.component';
import { IconComponent } from '@osf/shared/components/icon/icon.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SupportedFeature } from '@osf/shared/enums/addon-supported-features.enum';
import { FileKind } from '@osf/shared/enums/file-kind.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { FilesMapper } from '@osf/shared/mappers/files/files.mapper';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { FilesService } from '@osf/shared/services/files.service';
import { ToastService } from '@osf/shared/services/toast.service';
import {
  CurrentResourceSelectors,
  GetResourceDetails,
  GetResourceWithChildren,
} from '@osf/shared/stores/current-resource';
import { FileModel } from '@shared/models/files/file.model';
import { FileFolderModel } from '@shared/models/files/file-folder.model';

import { FileProvider } from '../../constants';

@Component({
  selector: 'osf-move-file-dialog',
  imports: [
    Button,
    Tooltip,
    TranslatePipe,
    ScrollerModule,
    IconComponent,
    LoadingSpinnerComponent,
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
  private readonly customConfirmationService = inject(CustomConfirmationService);

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
  readonly supportedFeatures = select(FilesSelectors.getStorageSupportedFeatures);

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
  private lastFolderId: string | null = null;
  private initialFolder = this.config.data.initialFolder;
  private fileProjectId = this.config.data.resourceId;

  readonly isFolderSame = computed(() => this.currentFolder()?.id === this.initialFolder?.id);

  readonly fileIdsInList = computed(() => new Set((this.config.data.files as FileModel[]).map((f) => f.id)));

  readonly isDestinationLoading = computed(
    () => this.isConfiguredStorageAddonsLoading() || this.areComponentsLoading() || this.isRootFoldersLoading()
  );

  readonly showFilesLoading = computed(
    () => this.isDestinationLoading() || ((this.isLoading() || this.isFilesUpdating()) && !this.isLoadingMore())
  );

  readonly hasAddUpdateFeature = computed(() => {
    const features = this.supportedFeatures()[this.provider()];
    return !!features && features.includes(SupportedFeature.AddUpdateFiles);
  });

  readonly buttonDisabled = computed(
    () =>
      this.isLoading() ||
      this.isFilesUpdating() ||
      this.isFolderSame() ||
      this.isDestinationLoading() ||
      !this.hasAddUpdateFeature()
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

  moveFiles(): void {
    const path = this.currentFolder()?.path;
    if (!path) {
      throw new Error(this.translateService.instant('files.dialogs.moveFile.pathError'));
    }

    this.isFilesUpdating.set(true);
    const headerKey = this.isMoveAction ? 'files.dialogs.moveFile.movingHeader' : 'files.dialogs.moveFile.copingHeader';
    this.config.header = this.translateService.instant(headerKey);
    const action = this.config.data.action;
    const files: FileModel[] = this.config.data.files;
    const totalFiles = files.length;
    let completed = 0;
    const conflictFiles: { file: FileModel; link: string }[] = [];

    files.forEach((file) => {
      const link = file.links.move;
      this.filesService
        .moveFile(link, path, this.fileProjectId, this.provider(), action)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((error) => {
            if (error.status === 409) {
              conflictFiles.push({ file, link });
            } else {
              this.showErrorToast(action, error.error?.message ?? 'Error');
            }
            return of(null);
          }),
          finalize(() => {
            completed++;
            if (completed === totalFiles) {
              if (conflictFiles.length > 0) {
                this.openReplaceMoveDialog(conflictFiles, path, action);
              } else {
                this.showSuccessToast(action);
                this.config.header = this.translateService.instant('files.dialogs.moveFile.title');
                this.completeMove();
              }
            }
          })
        )
        .subscribe();
    });
  }

  private openReplaceMoveDialog(
    conflictFiles: { file: FileModel; link: string }[],
    path: string,
    action: string
  ): void {
    this.customConfirmationService.confirmDelete({
      headerKey: conflictFiles.length > 1 ? 'files.dialogs.replaceFile.multiple' : 'files.dialogs.replaceFile.single',
      messageKey: 'files.dialogs.replaceFile.message',
      messageParams: {
        name: conflictFiles.map((c) => c.file.name).join(', '),
      },
      acceptLabelKey: 'common.buttons.replace',
      onConfirm: () => {
        const replaceRequests$ = conflictFiles.map(({ link }) =>
          this.filesService.moveFile(link, path, this.fileProjectId, this.provider(), action, true).pipe(
            takeUntilDestroyed(this.destroyRef),
            catchError(() => of(null))
          )
        );

        forkJoin(replaceRequests$).subscribe({
          next: () => {
            this.showSuccessToast(action);
            this.completeMove();
          },
        });
      },
      onReject: () => {
        const totalFiles = this.config.data.files.length;
        if (totalFiles > conflictFiles.length) {
          this.showErrorToast(action);
        }
        this.completeMove();
      },
    });
  }

  private showSuccessToast(action: string) {
    const messageType = action === 'move' ? 'moveFile' : 'copyFile';
    this.toastService.showSuccess(`files.dialogs.${messageType}.success`);
  }

  private showErrorToast(action: string, errorMessage?: string) {
    const messageType = action === 'move' ? 'moveFile' : 'copyFile';
    this.toastService.showError(errorMessage ?? `files.dialogs.${messageType}.error`);
  }

  private completeMove(): void {
    this.isFilesUpdating.set(false);
    this.actions.setCurrentFolder(this.initialFolder);
    this.actions.setMoveDialogCurrentFolder(null);
    this.dialogRef.close(true);
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

  onStorageChange() {
    this.foldersStack.set([]);
    this.previousFolder.set(null);
  }
}
