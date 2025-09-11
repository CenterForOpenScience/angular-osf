import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { TreeDragDropService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

import { debounceTime, distinctUntilChanged, EMPTY, filter, finalize, Observable, skip, switchMap, take } from 'rxjs';

import { HttpEventType } from '@angular/common/http';
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

import {
  CreateFolder,
  DeleteEntry,
  GetConfiguredStorageAddons,
  GetFiles,
  GetRootFolders,
  RenameEntry,
  ResetState,
  SetCurrentFolder,
  SetCurrentProvider,
  SetFilesIsLoading,
  SetMoveFileCurrentFolder,
  SetSearch,
  SetSort,
} from '@osf/features/files/store';
import { ALL_SORT_OPTIONS } from '@osf/shared/constants';
import { ResourceType } from '@osf/shared/enums';
import { hasViewOnlyParam, IS_MEDIUM } from '@osf/shared/helpers';
import {
  FilesTreeComponent,
  FormSelectComponent,
  LoadingSpinnerComponent,
  SearchInputComponent,
  SubHeaderComponent,
  ViewOnlyLinkMessageComponent,
} from '@shared/components';
import { GoogleFilePickerComponent } from '@shared/components/addons/storage-item-selector/google-file-picker/google-file-picker.component';
import { ConfiguredAddonModel, FileLabelModel, FilesTreeActions, OsfFile, StorageItemModel } from '@shared/models';
import { FilesService } from '@shared/services';
import { DataciteService } from '@shared/services/datacite/datacite.service';

import { CreateFolderDialogComponent, FileBrowserInfoComponent } from '../../components';
import { FileProvider } from '../../constants';
import { FilesSelectors } from '../../store';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-files',
  imports: [
    Button,
    Dialog,
    FilesTreeComponent,
    FloatLabel,
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
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, TreeDragDropService],
})
export class FilesComponent {
  googleFilePickerComponent = viewChild(GoogleFilePickerComponent);

  @HostBinding('class') classes = 'flex flex-column flex-1 w-full h-full';

  private readonly filesService = inject(FilesService);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogService = inject(DialogService);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
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
  });

  isMedium = toSignal(inject(IS_MEDIUM));

  readonly hasViewOnly = computed(() => {
    return hasViewOnlyParam(this.router);
  });
  readonly files = select(FilesSelectors.getFiles);
  readonly filesTotalCount = select(FilesSelectors.getFilesTotalCount);
  readonly isFilesLoading = select(FilesSelectors.isFilesLoading);
  readonly currentFolder = select(FilesSelectors.getCurrentFolder);
  readonly provider = select(FilesSelectors.getProvider);

  readonly isGoogleDrive = signal<boolean>(false);
  readonly accountId = signal<string>('');
  readonly selectedRootFolder = signal<StorageItemModel>({});
  readonly resourceId = signal<string>('');
  readonly rootFolders = select(FilesSelectors.getRootFolders);
  readonly isRootFoldersLoading = select(FilesSelectors.isRootFoldersLoading);
  readonly configuredStorageAddons = select(FilesSelectors.getConfiguredStorageAddons);
  readonly isConfiguredStorageAddonsLoading = select(FilesSelectors.isConfiguredStorageAddonsLoading);
  readonly dataciteService = inject(DataciteService);

  readonly progress = signal(0);
  readonly fileName = signal('');
  readonly dataLoaded = signal(false);
  readonly searchControl = new FormControl<string>('');
  readonly sortControl = new FormControl(ALL_SORT_OPTIONS[0].value);

  currentRootFolder = model<FileLabelModel | null>(null);

  fileIsUploading = signal(false);
  isFolderOpening = signal(false);

  sortOptions = ALL_SORT_OPTIONS;

  storageProvider = FileProvider.OsfStorage;
  pageNumber = signal(1);

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
  ]);

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

  readonly isViewOnly = computed(() => {
    return this.resourceType() === ResourceType.Registration;
  });

  readonly isViewOnlyDownloadable = computed(() => {
    return this.resourceType() === ResourceType.Registration;
  });

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
      const folderLink = `${environment.apiDomainUrl}/v2/${resourcePath}/${resourceId}/files/`;
      const iriLink = `${environment.webUrl}/${resourceId}`;
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
        this.isGoogleDrive.set(provider === FileProvider.GoogleDrive);
        if (this.isGoogleDrive()) {
          this.setGoogleAccountId();
        }
        this.actions.setCurrentProvider(provider ?? FileProvider.OsfStorage);
        this.actions.setCurrentFolder(currentRootFolder.folder);
      }
    });

    effect(() => {
      if (!this.isConfiguredStorageAddonsLoading() && !this.isRootFoldersLoading()) {
        this.dataLoaded.set(true);
      }
    });

    this.searchControl.valueChanges
      .pipe(skip(1), takeUntilDestroyed(this.destroyRef), distinctUntilChanged(), debounceTime(500))
      .subscribe((searchText) => {
        this.actions.setSearch(searchText ?? '');
        if (!this.isFolderOpening()) {
          this.updateFilesList();
        }
      });

    this.sortControl.valueChanges.pipe(skip(1), takeUntilDestroyed(this.destroyRef)).subscribe((sort) => {
      this.actions.setSort(sort ?? '');
      if (!this.isFolderOpening()) {
        this.updateFilesList();
      }
    });

    effect(() => {
      this.destroyRef.onDestroy(() => {
        this.actions.resetState();
      });
    });
  }

  isButtonDisabled(): boolean {
    return this.fileIsUploading() || this.isFilesLoading();
  }

  uploadFile(file: File): void {
    const currentFolder = this.currentFolder();
    const uploadLink = currentFolder?.links.upload;

    if (!uploadLink) return;

    this.fileName.set(file.name);
    this.fileIsUploading.set(true);

    this.filesService
      .uploadFile(file, uploadLink)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.fileIsUploading.set(false);
          this.fileName.set('');
          this.updateFilesList();
        })
      )
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress.set(Math.round((event.loaded / event.total) * 100));
        }
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadFile(file);
  }

  createFolder(): void {
    const currentFolder = this.currentFolder();
    const newFolderLink = currentFolder?.links.newFolder;

    if (!newFolderLink) return;

    this.dialogService
      .open(CreateFolderDialogComponent, {
        width: '448px',
        focusOnShow: false,
        header: this.translateService.instant('files.dialogs.createFolder.title'),
        closeOnEscape: true,
        modal: true,
        closable: true,
      })
      .onClose.pipe(
        filter((folderName: string) => !!folderName),
        switchMap((folderName: string) => {
          return this.actions.createFolder(newFolderLink, folderName);
        }),
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
    const resourcePath = this.urlMap.get(this.resourceType()) ?? 'nodes';

    if (resourceId && folderId) {
      this.dataciteService.logFileDownload(resourceId, resourcePath).subscribe();
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

    this.dialogService.open(FileBrowserInfoComponent, {
      width: dialogWidth,
      focusOnShow: false,
      header: this.translateService.instant('files.filesBrowserDialog.title'),
      closeOnEscape: true,
      modal: true,
      closable: true,
      data: this.resourceType(),
    });
  }

  public updateFilesList = (): Observable<void> => {
    const currentFolder = this.currentFolder();
    if (currentFolder?.relationships.filesLink) {
      this.filesTreeActions.setFilesIsLoading?.(true);
      return this.actions.getFiles(currentFolder?.relationships.filesLink).pipe(take(1));
    }

    return EMPTY;
  };

  folderIsOpening(value: boolean): void {
    this.isFolderOpening.set(value);
    if (value) {
      this.searchControl.setValue('');
      this.sortControl.setValue(ALL_SORT_OPTIONS[0].value);
    }
  }

  navigateToFile(file: OsfFile) {
    this.router.navigate([file.guid], { relativeTo: this.activeRoute });
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

  openGoogleFilePicker(): void {
    this.googleFilePickerComponent()?.createPicker();
    this.updateFilesList();
  }
}
