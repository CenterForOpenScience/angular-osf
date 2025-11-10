import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { TreeDragDropService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  forkJoin,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';

import { HttpEventType, HttpResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  HostBinding,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import {
  CreateFolder,
  DeleteEntry,
  GetConfiguredStorageAddons,
  GetFiles,
  GetRootFolders,
  GetStorageSupportedFeatures,
  RenameEntry,
  ResetState,
  SetCurrentFolder,
  SetCurrentProvider,
  SetMoveDialogCurrentFolder,
  SetSearch,
  SetSort,
} from '@osf/features/files/store';
import { FileUploadDialogComponent } from '@osf/shared/components/file-upload-dialog/file-upload-dialog.component';
import { FilesTreeComponent } from '@osf/shared/components/files-tree/files-tree.component';
import { FormSelectComponent } from '@osf/shared/components/form-select/form-select.component';
import { GoogleFilePickerComponent } from '@osf/shared/components/google-file-picker/google-file-picker.component';
import { LoadingSpinnerComponent } from '@osf/shared/components/loading-spinner/loading-spinner.component';
import { SearchInputComponent } from '@osf/shared/components/search-input/search-input.component';
import { SubHeaderComponent } from '@osf/shared/components/sub-header/sub-header.component';
import { ViewOnlyLinkMessageComponent } from '@osf/shared/components/view-only-link-message/view-only-link-message.component';
import { FILE_SIZE_LIMIT } from '@osf/shared/constants/files-limits.const';
import { ALL_SORT_OPTIONS } from '@osf/shared/constants/sort-options.const';
import { SupportedFeature } from '@osf/shared/enums/addon-supported-features.enum';
import { FileMenuType } from '@osf/shared/enums/file-menu-type.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { getViewOnlyParamFromUrl, hasViewOnlyParam } from '@osf/shared/helpers/view-only.helper';
import { CustomConfirmationService } from '@osf/shared/services/custom-confirmation.service';
import { CustomDialogService } from '@osf/shared/services/custom-dialog.service';
import { FilesService } from '@osf/shared/services/files.service';
import { ToastService } from '@osf/shared/services/toast.service';
import { CurrentResourceSelectors, GetResourceDetails } from '@osf/shared/stores/current-resource';
import { ConfiguredAddonModel } from '@shared/models/addons/configured-addon.model';
import { StorageItem } from '@shared/models/addons/storage-item.model';
import { FileModel } from '@shared/models/files/file.model';
import { FileFolderModel } from '@shared/models/files/file-folder.model';
import { FileLabelModel } from '@shared/models/files/file-label.model';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import {
  CreateFolderDialogComponent,
  FileBrowserInfoComponent,
  FilesSelectionActionsComponent,
  MoveFileDialogComponent,
} from '../../components';
import { FileProvider } from '../../constants';
import { FilesSelectors } from '../../store';

@Component({
  selector: 'osf-files',
  imports: [
    Button,
    FileUploadDialogComponent,
    FilesTreeComponent,
    FormSelectComponent,
    FormsModule,
    GoogleFilePickerComponent,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    SearchInputComponent,
    Select,
    SubHeaderComponent,
    TableModule,
    TranslatePipe,
    ViewOnlyLinkMessageComponent,
    GoogleFilePickerComponent,
    FilesSelectionActionsComponent,
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TreeDragDropService],
})
export class FilesComponent {
  googleFilePickerComponent = viewChild(GoogleFilePickerComponent);

  @HostBinding('class') classes = 'flex flex-column flex-1 w-full h-full';

  private readonly filesService = inject(FilesService);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customDialogService = inject(CustomDialogService);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly dataciteService = inject(DataciteService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly customConfirmationService = inject(CustomConfirmationService);
  private readonly toastService = inject(ToastService);

  private readonly webUrl = this.environment.webUrl;
  private readonly apiDomainUrl = this.environment.apiDomainUrl;

  private readonly actions = createDispatchMap({
    createFolder: CreateFolder,
    getFiles: GetFiles,
    deleteEntry: DeleteEntry,
    renameEntry: RenameEntry,
    setCurrentFolder: SetCurrentFolder,
    setMoveDialogCurrentFolder: SetMoveDialogCurrentFolder,
    setSearch: SetSearch,
    setSort: SetSort,
    getRootFolders: GetRootFolders,
    getConfiguredStorageAddons: GetConfiguredStorageAddons,
    setCurrentProvider: SetCurrentProvider,
    resetState: ResetState,
    getResourceDetails: GetResourceDetails,
    getStorageSupportedFeatures: GetStorageSupportedFeatures,
  });

  readonly files = select(FilesSelectors.getFiles);
  readonly filesTotalCount = select(FilesSelectors.getFilesTotalCount);
  readonly isFilesLoading = select(FilesSelectors.isFilesLoading);
  readonly currentFolder = select(FilesSelectors.getCurrentFolder);
  readonly provider = select(FilesSelectors.getProvider);
  readonly resourceDetails = select(CurrentResourceSelectors.getResourceDetails);
  readonly resourceMetadata = select(CurrentResourceSelectors.getCurrentResource);
  readonly rootFolders = select(FilesSelectors.getRootFolders);
  readonly isRootFoldersLoading = select(FilesSelectors.isRootFoldersLoading);
  readonly configuredStorageAddons = select(FilesSelectors.getConfiguredStorageAddons);
  readonly isConfiguredStorageAddonsLoading = select(FilesSelectors.isConfiguredStorageAddonsLoading);
  readonly supportedFeatures = select(FilesSelectors.getStorageSupportedFeatures);

  readonly isGoogleDrive = signal<boolean>(false);
  readonly accountId = signal<string>('');
  readonly selectedRootFolder = signal<StorageItem>({});
  readonly resourceId = signal<string>('');

  readonly progress = signal(0);
  readonly fileName = signal('');
  readonly dataLoaded = signal(false);
  readonly searchControl = new FormControl<string>('');
  readonly sortControl = new FormControl(ALL_SORT_OPTIONS[0].value);

  foldersStack = [] as FileFolderModel[];

  currentRootFolder = model<FileLabelModel | null>(null);

  fileIsUploading = signal(false);
  isMoveDialogOpened = signal(false);

  sortOptions = ALL_SORT_OPTIONS;

  pageNumber = signal(1);

  allowRevisions = false;
  filesSelection: FileModel[] = [];

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
  ]);

  readonly allowedMenuActions = computed(() => {
    const provider = this.provider();
    const supportedFeatures = this.supportedFeatures()[provider] || [];
    const hasViewOnly = this.hasViewOnly();
    const isRegistration = this.resourceType() === ResourceType.Registration;
    const menuMap = this.mapMenuActions(supportedFeatures);

    const result: Record<FileMenuType, boolean> = { ...menuMap };

    if (hasViewOnly || isRegistration || !this.canEdit()) {
      const allowed = new Set<FileMenuType>([FileMenuType.Download, FileMenuType.Embed, FileMenuType.Share]);

      (Object.keys(result) as FileMenuType[]).forEach((key) => {
        result[key] = allowed.has(key) && menuMap[key];
      });
    }

    return result;
  });

  readonly rootFoldersOptions = computed(() => {
    const rootFolders = this.rootFolders();
    const addons = this.configuredStorageAddons();
    if (rootFolders && addons) {
      return rootFolders.map((folder) => ({
        label: this.getAddonName(addons, folder.provider),
        folder: folder,
      }));
    }
    return [];
  });

  resourceType = signal<ResourceType>(
    this.activeRoute.parent?.parent?.snapshot.data['resourceType'] || ResourceType.Project
  );

  readonly hasViewOnly = computed(() => hasViewOnlyParam(this.router));

  readonly canEdit = computed(() => {
    const details = this.resourceDetails();
    const hasAdminOrWrite = details.currentUserPermissions?.some(
      (permission) => permission === UserPermissions.Admin || permission === UserPermissions.Write
    );

    return hasAdminOrWrite;
  });

  readonly isRegistration = computed(() => this.resourceType() === ResourceType.Registration);

  canUploadFiles = computed(
    () =>
      this.supportedFeatures()[this.provider()]?.includes(SupportedFeature.AddUpdateFiles) &&
      this.canEdit() &&
      !this.isRegistration()
  );

  isButtonDisabled = computed(() => this.fileIsUploading() || this.isFilesLoading());

  isGoogleDriveButtonDisabled = computed(
    () => this.isButtonDisabled() || (this.googleFilePickerComponent()?.isGFPDisabled() ?? false)
  );

  private route = inject(ActivatedRoute);
  readonly providerName = toSignal(
    this.route?.params?.pipe(map((params) => params['fileProvider'])) ?? of('osfstorage')
  );

  constructor() {
    this.activeRoute.parent?.parent?.parent?.params.subscribe((params) => {
      if (params['id']) {
        this.resourceId.set(params['id']);
      }
    });

    effect(() => {
      const resourceId = this.resourceId();

      const resourcePath = this.urlMap.get(this.resourceType()!);
      const folderLink = `${this.apiDomainUrl}/v2/${resourcePath}/${resourceId}/files/`;
      const iriLink = `${this.webUrl}/${resourceId}`;

      this.actions.getResourceDetails(resourceId, this.resourceType()!);
      this.actions.getRootFolders(folderLink);
      this.actions.getConfiguredStorageAddons(iriLink);
    });

    effect(() => {
      const rootFoldersOptions = this.rootFoldersOptions();
      const providerName = this.providerName();

      if (rootFoldersOptions && rootFoldersOptions.length && providerName) {
        const rootFoldersOption = rootFoldersOptions.find((option) => option.folder.provider === providerName);

        if (!rootFoldersOption) {
          this.router.navigate([`/${this.resourceId()}/files`, FileProvider.OsfStorage]);
        } else {
          this.currentRootFolder.set({
            label: rootFoldersOption.label,
            folder: rootFoldersOption.folder,
          });
        }
      }
    });

    effect(() => {
      const currentRootFolder = this.currentRootFolder();
      if (currentRootFolder) {
        const provider = currentRootFolder.folder?.provider;
        const storageId = currentRootFolder.folder?.id;
        // [NM TODO] Check if other providers allow revisions
        this.allowRevisions = provider === FileProvider.OsfStorage;
        this.isGoogleDrive.set(provider === FileProvider.GoogleDrive);
        if (this.isGoogleDrive()) {
          this.setGoogleAccountId();
        }
        if (storageId) {
          this.actions.getStorageSupportedFeatures(storageId, provider);
        }
        this.actions.setCurrentProvider(provider ?? FileProvider.OsfStorage);
        this.actions.setCurrentFolder(currentRootFolder.folder);
        this.filesSelection = [];
      }
    });

    effect(() => {
      if (!this.isConfiguredStorageAddonsLoading() && !this.isRootFoldersLoading()) {
        this.dataLoaded.set(true);
      }
    });

    effect(() => {
      const currentFolder = this.currentFolder();
      if (currentFolder) {
        this.pageNumber.set(1);
        this.updateFilesList();
      }
    });

    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged(), debounceTime(500))
      .subscribe((searchText) => {
        this.actions.setSearch(searchText ?? '');

        this.updateFilesList();
      });

    this.sortControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((sort) => {
      this.actions.setSort(sort ?? '');

      this.updateFilesList();
    });

    this.destroyRef.onDestroy(() => {
      this.actions.resetState();
    });
  }

  onLoadFiles(event: { link: string; page: number }) {
    this.actions.getFiles(event.link, event.page);
  }

  uploadFiles(files: File | File[]): void {
    const currentFolder = this.currentFolder();
    const uploadLink = currentFolder?.links.upload;
    if (!uploadLink) return;

    const fileArray = Array.isArray(files) ? files : [files];
    if (fileArray.length === 0) return;

    this.fileName.set(fileArray.length === 1 ? fileArray[0].name : `${fileArray.length} files`);
    this.fileIsUploading.set(true);
    this.progress.set(0);

    let completedUploads = 0;
    const totalFiles = fileArray.length;
    const conflictFiles: { file: File; link: string }[] = [];

    fileArray.forEach((file) => {
      this.filesService
        .uploadFile(file, uploadLink)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          catchError((err) => {
            const conflictLink = err.error?.data?.links?.upload;
            if (err.status === 409 && conflictLink) {
              if (this.allowRevisions) {
                return this.filesService.uploadFile(file, conflictLink, true);
              } else {
                conflictFiles.push({ file, link: conflictLink });
              }
            }
            return of(new HttpResponse());
          })
        )
        .subscribe((event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            const progressPercentage = Math.round((event.loaded / event.total) * 100);
            if (totalFiles === 1) {
              this.progress.set(progressPercentage);
            }
          }

          if (event.type === HttpEventType.Response) {
            completedUploads++;

            if (totalFiles > 1) {
              const progressPercentage = Math.round((completedUploads / totalFiles) * 100);
              this.progress.set(progressPercentage);
            }

            if (completedUploads === totalFiles) {
              if (conflictFiles.length > 0) {
                this.openReplaceFileDialog(conflictFiles);
              } else {
                this.completeUpload();
              }
            }
          }
        });
    });
  }

  private openReplaceFileDialog(conflictFiles: { file: File; link: string }[]) {
    this.customConfirmationService.confirmDelete({
      headerKey: conflictFiles.length > 1 ? 'files.dialogs.replaceFile.multiple' : 'files.dialogs.replaceFile.single',
      messageKey: 'files.dialogs.replaceFile.message',
      messageParams: {
        name: conflictFiles.map((c) => c.file.name).join(', '),
      },
      acceptLabelKey: 'common.buttons.replace',
      onConfirm: () => {
        const replaceRequests$ = conflictFiles.map(({ file, link }) =>
          this.filesService.uploadFile(file, link, true).pipe(
            takeUntilDestroyed(this.destroyRef),
            catchError(() => of(null))
          )
        );

        forkJoin(replaceRequests$).subscribe({
          next: () => this.completeUpload(),
        });
      },
    });
  }

  private completeUpload(): void {
    this.fileIsUploading.set(false);
    this.fileName.set('');
    this.updateFilesList();
  }

  onFileTreeSelected(file: FileModel): void {
    this.filesSelection = [...this.filesSelection, file];
  }

  onFileTreeUnselected(file: FileModel): void {
    this.filesSelection = this.filesSelection.filter((f) => f.id !== file.id);
  }

  onClearSelection(): void {
    this.filesSelection = [];
  }

  onDeleteSelected(): void {
    if (!this.filesSelection.length) return;

    this.customConfirmationService.confirmDelete({
      headerKey: 'files.dialogs.deleteMultipleItems.title',
      messageKey: 'files.dialogs.deleteMultipleItems.message',
      messageParams: {
        name: this.filesSelection.map((f) => f.name).join(', '),
      },
      acceptLabelKey: 'common.buttons.delete',
      onConfirm: () => {
        const deleteRequests$ = this.filesSelection.map((file) =>
          this.actions.deleteEntry(file.links.delete).pipe(catchError(() => of(null)))
        );

        forkJoin(deleteRequests$)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.toastService.showSuccess('files.dialogs.deleteFile.success');
              this.filesSelection = [];
              this.updateFilesList();
            },
          });
      },
    });
  }

  onMoveSelected(): void {
    this.moveFiles(this.filesSelection, 'move');
  }

  onCopySelected(): void {
    this.moveFiles(this.filesSelection, 'copy');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    for (const file of files) {
      if (file.size >= FILE_SIZE_LIMIT) {
        this.toastService.showWarn('shared.files.limitText');
        return;
      }
    }

    this.uploadFiles(Array.from(files));
  }

  moveFiles(files: FileModel[], action: string): void {
    const currentFolder = this.currentFolder();
    this.actions.setMoveDialogCurrentFolder(currentFolder);
    this.isMoveDialogOpened.set(true);
    this.customDialogService
      .open(MoveFileDialogComponent, {
        header: 'files.dialogs.moveFile.title',
        width: '552px',
        data: {
          files: files,
          resourceId: this.resourceId(),
          action: action,
          storageProvider: this.provider(),
          foldersStack: this.foldersStack,
          initialFolder: structuredClone(this.currentFolder()),
        },
      })
      .onClose.subscribe((result) => {
        if (result) {
          this.filesSelection = [];
        }
        this.isMoveDialogOpened.set(false);
        this.resetProvider();
      });
  }

  resetProvider() {
    const currentRootFolder = this.currentRootFolder();
    const provider = currentRootFolder?.folder?.provider;
    if (provider) {
      this.actions.setCurrentProvider(provider);
    }
  }

  createFolder(): void {
    const currentFolder = this.currentFolder();
    const newFolderLink = currentFolder?.links.newFolder;

    if (!newFolderLink) return;

    this.customDialogService
      .open(CreateFolderDialogComponent, {
        header: 'files.dialogs.createFolder.title',
        width: '448px',
      })
      .onClose.pipe(
        filter((folderName: string) => !!folderName),
        switchMap((folderName: string) => this.actions.createFolder(newFolderLink, folderName)),
        take(1),
        finalize(() => {
          this.updateFilesList();
          this.fileIsUploading.set(false);
          this.toastService.showSuccess('files.dialogs.createFolder.success');
        })
      )
      .subscribe();
  }

  downloadFolder(): void {
    const resourceId = this.resourceId();
    const resourcePath = this.resourceMetadata()?.type ?? 'nodes';
    const downloadLink = this.currentFolder()?.links.download ?? '';
    if (resourceId && downloadLink) {
      this.dataciteService
        .logFileDownload(resourceId, resourcePath)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
      const link = this.filesService.getFolderDownloadLink(downloadLink);
      window.open(link, '_blank')?.focus();
    }
  }

  showInfoDialog() {
    this.customDialogService.open(FileBrowserInfoComponent, {
      header: 'files.filesBrowserDialog.title',
      width: '850px',
      data: this.resourceType(),
    });
  }

  updateFilesList() {
    const currentFolder = this.currentFolder();
    const filesLink = currentFolder?.links.filesLink;
    if (filesLink) {
      this.actions.getFiles(filesLink, this.pageNumber());
    }
  }

  setCurrentFolder(folder: FileFolderModel) {
    this.actions.setCurrentFolder(folder);
  }

  setMoveDialogCurrentFolder(folder: FileFolderModel) {
    this.actions.setMoveDialogCurrentFolder(folder);
  }

  deleteEntry(link: string) {
    this.actions.deleteEntry(link).subscribe(() => {
      this.toastService.showSuccess('files.dialogs.deleteFile.success');
      this.updateFilesList();
    });
  }

  renameEntry(event: { newName: string; link: string }) {
    const { newName, link } = event;
    this.actions.renameEntry(link, newName).subscribe(() => {
      this.toastService.showSuccess('files.dialogs.renameFile.success');
      this.updateFilesList();
    });
  }

  navigateToFile(file: FileModel) {
    const extras = this.hasViewOnly()
      ? { queryParams: { view_only: getViewOnlyParamFromUrl(this.router.url) } }
      : undefined;

    const url = this.router.serializeUrl(this.router.createUrlTree(['/', file.guid], extras));

    window.open(url, '_blank');
  }

  getAddonName(addons: ConfiguredAddonModel[], provider: string): string {
    if (provider === FileProvider.OsfStorage) {
      return this.translateService.instant('files.storageLocation');
    } else {
      return addons.find((addon) => addon.externalServiceName === provider)?.displayName ?? '';
    }
  }

  private setGoogleAccountId(): void {
    const addons = this.configuredStorageAddons();
    const googleDrive = addons?.find((addon) => addon.externalServiceName === FileProvider.GoogleDrive);
    if (googleDrive) {
      this.accountId.set(googleDrive.baseAccountId);
      this.selectedRootFolder.set({
        itemId: googleDrive.selectedStorageItemId,
      });
    }
  }

  private mapMenuActions(supportedFeatures: SupportedFeature[]): Record<FileMenuType, boolean> {
    return {
      [FileMenuType.Download]: supportedFeatures.includes(SupportedFeature.DownloadAsZip),
      [FileMenuType.Rename]: supportedFeatures.includes(SupportedFeature.AddUpdateFiles),
      [FileMenuType.Delete]: supportedFeatures.includes(SupportedFeature.DeleteFiles),
      [FileMenuType.Move]:
        supportedFeatures.includes(SupportedFeature.CopyInto) &&
        supportedFeatures.includes(SupportedFeature.DeleteFiles) &&
        supportedFeatures.includes(SupportedFeature.AddUpdateFiles),
      [FileMenuType.Embed]: true,
      [FileMenuType.Share]: true,
      [FileMenuType.Copy]: true,
    };
  }

  openGoogleFilePicker(): void {
    this.googleFilePickerComponent()?.createPicker();
    this.updateFilesList();
  }

  onUpdateFoldersStack(newStack: FileFolderModel[]): void {
    this.foldersStack = [...newStack];
  }

  handleRootFolderChange(selectedFolder: FileLabelModel) {
    const provider = selectedFolder.folder?.provider;
    const resourceId = this.resourceId();
    this.router.navigate([`/${resourceId}/files`, provider]);
  }
}
