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
  EMPTY,
  filter,
  finalize,
  forkJoin,
  Observable,
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
  SetFilesIsLoading,
  SetMoveFileCurrentFolder,
  SetSearch,
  SetSort,
} from '@osf/features/files/store';
import { ALL_SORT_OPTIONS, FILE_SIZE_LIMIT } from '@osf/shared/constants';
import { FileMenuType, ResourceType, SupportedFeature, UserPermissions } from '@osf/shared/enums';
import { getViewOnlyParamFromUrl, hasViewOnlyParam, IS_MEDIUM } from '@osf/shared/helpers';
import { CurrentResourceSelectors, GetResourceDetails } from '@osf/shared/stores';
import {
  FilesTreeComponent,
  FileUploadDialogComponent,
  FormSelectComponent,
  GoogleFilePickerComponent,
  LoadingSpinnerComponent,
  SearchInputComponent,
  SubHeaderComponent,
  ViewOnlyLinkMessageComponent,
} from '@shared/components';
import { ConfiguredAddonModel, FileLabelModel, FilesTreeActions, OsfFile, StorageItem } from '@shared/models';
import { CustomConfirmationService, CustomDialogService, FilesService, ToastService } from '@shared/services';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { CreateFolderDialogComponent, FileBrowserInfoComponent } from '../../components';
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
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TreeDragDropService],
})
export class FilesComponent {
  googleFilePickerComponent = viewChild(GoogleFilePickerComponent);
  filesTree = viewChild<FilesTreeComponent>(FilesTreeComponent);

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
    deleteEntry: DeleteEntry,
    getFiles: GetFiles,
    renameEntry: RenameEntry,
    setCurrentFolder: SetCurrentFolder,
    setFilesIsLoading: SetFilesIsLoading,
    setMoveFileCurrentFolder: SetMoveFileCurrentFolder,
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

  isMedium = toSignal(inject(IS_MEDIUM));

  readonly isGoogleDrive = signal<boolean>(false);
  readonly accountId = signal<string>('');
  readonly selectedRootFolder = signal<StorageItem>({});
  readonly resourceId = signal<string>('');

  readonly progress = signal(0);
  readonly fileName = signal('');
  readonly dataLoaded = signal(false);
  readonly searchControl = new FormControl<string>('');
  readonly sortControl = new FormControl(ALL_SORT_OPTIONS[0].value);

  currentRootFolder = model<FileLabelModel | null>(null);

  fileIsUploading = signal(false);
  isFolderOpening = signal(false);

  sortOptions = ALL_SORT_OPTIONS;

  pageNumber = signal(1);

  allowRevisions = false;

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
    const hasAdminOrWrite = details.currentUserPermissions.some(
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

  readonly filesTreeActions: FilesTreeActions = {
    setCurrentFolder: (folder) => this.actions.setCurrentFolder(folder),
    setFilesIsLoading: (isLoading) => this.actions.setFilesIsLoading(isLoading),
    getFiles: (filesLink) => this.actions.getFiles(filesLink, this.pageNumber()),
    deleteEntry: (resourceId, link) => this.actions.deleteEntry(resourceId, link),
    renameEntry: (resourceId, link, newName) => this.actions.renameEntry(resourceId, link, newName),
    setMoveFileCurrentFolder: (folder) => this.actions.setMoveFileCurrentFolder(folder),
  };

  constructor() {
    this.activeRoute.parent?.parent?.parent?.params.subscribe((params) => {
      if (params['id']) {
        this.resourceId.set(params['id']);
        this.filesTreeActions.setFilesIsLoading?.(true);
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
      const rootFolders = this.rootFolders();
      if (rootFolders) {
        const osfRootFolder = rootFolders.find((folder: OsfFile) => folder.provider === FileProvider.OsfStorage);
        if (osfRootFolder) {
          this.currentRootFolder.set({
            label: this.translateService.instant('files.storageLocation'),
            folder: osfRootFolder,
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
        this.filesTree()?.resetPagination();
      }
    });

    effect(() => {
      if (!this.isConfiguredStorageAddonsLoading() && !this.isRootFoldersLoading()) {
        this.dataLoaded.set(true);
      }
    });

    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), distinctUntilChanged(), debounceTime(500))
      .subscribe((searchText) => {
        this.actions.setSearch(searchText ?? '');
        this.filesTree()?.resetPagination();

        if (!this.isFolderOpening()) {
          this.updateFilesList();
        }
      });

    this.sortControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((sort) => {
      this.actions.setSort(sort ?? '');
      this.filesTree()?.resetPagination();

      if (!this.isFolderOpening()) {
        this.updateFilesList();
      }
    });

    this.destroyRef.onDestroy(() => {
      this.actions.resetState();
    });
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
        })
      )
      .subscribe();
  }

  downloadFolder(): void {
    const resourceId = this.resourceId();
    const folderId = this.currentFolder()?.id ?? '';
    const isRootFolder = !this.currentFolder()?.relationships?.parentFolderLink;
    const storageLink = this.currentRootFolder()?.folder?.links?.download ?? '';
    const resourcePath = this.resourceMetadata()?.type ?? 'nodes';

    if (resourceId && folderId) {
      this.dataciteService
        .logFileDownload(resourceId, resourcePath)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
      if (isRootFolder) {
        const link = this.filesService.getFolderDownloadLink(storageLink, '', true);
        window.open(link, '_blank')?.focus();
      } else {
        const link = this.filesService.getFolderDownloadLink(storageLink, folderId, false);
        window.open(link, '_blank')?.focus();
      }
    }
  }

  showInfoDialog() {
    const dialogWidth = this.isMedium() ? '850px' : '95vw';

    this.customDialogService.open(FileBrowserInfoComponent, {
      header: 'files.filesBrowserDialog.title',
      width: dialogWidth,
      data: this.resourceType(),
    });
  }

  updateFilesList(): Observable<void> {
    const currentFolder = this.currentFolder();
    if (currentFolder?.relationships.filesLink) {
      this.filesTreeActions.setFilesIsLoading?.(true);
      return this.actions.getFiles(currentFolder?.relationships.filesLink).pipe(take(1));
    }

    return EMPTY;
  }

  folderIsOpening(value: boolean): void {
    this.isFolderOpening.set(value);
    if (value) {
      this.searchControl.setValue('');
      this.sortControl.setValue(ALL_SORT_OPTIONS[0].value);
    }
  }

  navigateToFile(file: OsfFile) {
    let url = file.links?.html ?? '';
    const viewOnlyParam = this.hasViewOnly();
    if (viewOnlyParam) {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}view_only=${getViewOnlyParamFromUrl(this.router.url)}`;
    }
    window.open(url, '_blank');
  }

  getAddonName(addons: ConfiguredAddonModel[], provider: string): string {
    if (provider === FileProvider.OsfStorage) {
      return this.translateService.instant('files.storageLocation');
    } else {
      return addons.find((addon) => addon.externalServiceName === provider)?.displayName ?? '';
    }
  }

  onFilesPageChange(page: number) {
    this.pageNumber.set(page);
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
      [FileMenuType.Copy]:
        supportedFeatures.includes(SupportedFeature.CopyInto) &&
        supportedFeatures.includes(SupportedFeature.AddUpdateFiles),
    };
  }

  openGoogleFilePicker(): void {
    this.googleFilePickerComponent()?.createPicker();
    this.updateFilesList();
  }
}
