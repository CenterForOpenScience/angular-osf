import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { TreeDragDropService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

import { debounceTime, EMPTY, filter, finalize, Observable, skip, take } from 'rxjs';

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
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  SetFilesIsLoading,
  SetMoveFileCurrentFolder,
  SetSearch,
  SetSort,
} from '@osf/features/files/store';
import { GetProjectById } from '@osf/features/project/overview/store';
import { ALL_SORT_OPTIONS } from '@osf/shared/constants';
import {
  FilesTreeComponent,
  FormSelectComponent,
  LoadingSpinnerComponent,
  SearchInputComponent,
  SubHeaderComponent,
} from '@shared/components';
import { ConfiguredStorageAddon, FilesTreeActions, OsfFile } from '@shared/models';
import { FilesService } from '@shared/services';

import { CreateFolderDialogComponent } from '../../components';
import { FileProvider } from '../../constants';
import { FilesSelectors } from '../../store';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-files',
  imports: [
    TableModule,
    Button,
    FloatLabel,
    SubHeaderComponent,
    SearchInputComponent,
    Select,
    LoadingSpinnerComponent,
    Dialog,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    FilesTreeComponent,
    FormSelectComponent,
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, TreeDragDropService],
})
export class FilesComponent {
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
    getProject: GetProjectById,
    getRootFolders: GetRootFolders,
    getConfiguredStorageAddons: GetConfiguredStorageAddons,
    resetState: ResetState,
  });

  protected readonly files = select(FilesSelectors.getFiles);
  protected readonly isFilesLoading = select(FilesSelectors.isFilesLoading);
  protected readonly currentFolder = select(FilesSelectors.getCurrentFolder);
  protected readonly provider = select(FilesSelectors.getProvider);

  protected readonly resourceId = signal<string>('');
  private readonly rootFolders = select(FilesSelectors.getRootFolders);
  protected isRootFoldersLoading = select(FilesSelectors.isRootFoldersLoading);
  private readonly configuredStorageAddons = select(FilesSelectors.getConfiguredStorageAddons);
  protected isConfiguredStorageAddonsLoading = select(FilesSelectors.isConfiguredStorageAddonsLoading);
  protected currentRootFolder = model<{ label: string; folder: OsfFile } | null>(null);
  protected readonly progress = signal(0);
  protected readonly fileName = signal('');
  protected readonly dataLoaded = signal(false);
  protected readonly searchControl = new FormControl<string>('');
  protected readonly sortControl = new FormControl(ALL_SORT_OPTIONS[0].value);

  protected readonly rootFoldersOptions = computed(() => {
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

  fileIsUploading = signal(false);
  isFolderOpening = signal(false);

  sortOptions = ALL_SORT_OPTIONS;

  storageProvider = FileProvider.OsfStorage;

  protected readonly filesTreeActions: FilesTreeActions = {
    setCurrentFolder: (folder) => this.actions.setCurrentFolder(folder),
    setFilesIsLoading: (isLoading) => this.actions.setFilesIsLoading(isLoading),
    getFiles: (filesLink) => this.actions.getFiles(filesLink),
    deleteEntry: (resourceId, link) => this.actions.deleteEntry(resourceId, link),
    renameEntry: (resourceId, link, newName) => this.actions.renameEntry(resourceId, link, newName),
    setMoveFileCurrentFolder: (folder) => this.actions.setMoveFileCurrentFolder(folder),
  };

  constructor() {
    this.activeRoute.parent?.parent?.parent?.params.subscribe((params) => {
      console.log(params);
      if (params['id']) {
        this.resourceId.set(params['id']);
        this.filesTreeActions.setFilesIsLoading?.(true);
      }
    });

    effect(() => {
      const resourcePath = 'nodes';
      const folderLink = `${environment.apiUrl}/${resourcePath}/${this.resourceId()}/files/${this.storageProvider}/`;
      const iriLink = `${environment.apiUrl}/${this.resourceId()}/`;
      this.actions.getRootFolders(folderLink);
      this.actions.getConfiguredStorageAddons(iriLink);
    });

    effect(() => {
      const rootFolders = this.rootFolders();

      if (rootFolders) {
        const osfRootFolder = rootFolders.find((folder) => folder.provider === 'osfstorage');
        if (osfRootFolder) {
          this.currentRootFolder.set({
            label: 'Osf Storage',
            folder: osfRootFolder,
          });
        }
      }
    });

    effect(() => {
      const currentRootFolder = this.currentRootFolder();

      if (currentRootFolder) {
        this.actions.setCurrentFolder(currentRootFolder.folder);
      }
    });

    effect(() => {
      if (!this.isConfiguredStorageAddonsLoading() && !this.isRootFoldersLoading()) {
        this.dataLoaded.set(true);
      }
    });

    this.searchControl.valueChanges
      .pipe(skip(1), takeUntilDestroyed(this.destroyRef), debounceTime(500))
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

        if (event.type === HttpEventType.Response) {
          if (event.body) {
            const fileId = event?.body?.data?.id?.split('/').pop();
            if (fileId) {
              this.filesService.getFileGuid(fileId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
            }
          }
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
      .onClose.pipe(filter((folderName: string) => !!folderName))
      .subscribe((folderName) => {
        this.actions
          .createFolder(newFolderLink, folderName)
          .pipe(
            take(1),
            finalize(() => {
              this.updateFilesList().subscribe(() => this.fileIsUploading.set(false));
            })
          )
          .subscribe();
      });
  }

  downloadFolder(): void {
    const resourceId = this.resourceId();
    const folderId = this.currentFolder()?.id ?? '';
    const isRootFolder = !this.currentFolder()?.relationships?.parentFolderLink;
    const provider = this.currentRootFolder()?.folder?.provider ?? 'osfstorage';

    if (resourceId && folderId) {
      if (isRootFolder) {
        const link = this.filesService.getFolderDownloadLink(resourceId, provider, '', true);
        window.open(link, '_blank')?.focus();
      } else {
        const link = this.filesService.getFolderDownloadLink(resourceId, provider, folderId, false);
        window.open(link, '_blank')?.focus();
      }
    }
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
    this.router.navigate([file.guid], { relativeTo: this.activeRoute });
  }

  getAddonName(addons: ConfiguredStorageAddon[], provider: string): string {
    if (provider === 'osfstorage') {
      return 'Osf Storage';
    } else {
      return addons.find((addon) => addon.externalServiceName === provider)?.displayName ?? '';
    }
  }
}
