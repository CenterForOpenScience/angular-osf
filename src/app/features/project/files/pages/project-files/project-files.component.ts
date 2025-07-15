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

import { CreateFolderDialogComponent } from '@osf/features/project/files/components';
import { FilesTreeActions } from '@osf/features/project/files/models';
import {
  CreateFolder,
  DeleteEntry,
  GetConfiguredStorageAddons,
  GetFiles,
  GetRootFolders,
  ProjectFilesSelectors,
  RenameEntry,
  SetCurrentFolder,
  SetFilesIsLoading,
  SetMoveFileCurrentFolder,
  SetSearch,
  SetSort,
} from '@osf/features/project/files/store';
import { approveFile } from '@osf/features/project/files/utils';
import { GetProjectById, ProjectOverviewSelectors } from '@osf/features/project/overview/store';
import { ALL_SORT_OPTIONS } from '@osf/shared/constants';
import {
  FilesTreeComponent,
  FormSelectComponent,
  LoadingSpinnerComponent,
  SearchInputComponent,
  SubHeaderComponent,
} from '@shared/components';
import { ConfiguredStorageAddon, OsfFile } from '@shared/models';
import { FilesService } from '@shared/services';

@Component({
  selector: 'osf-project-files',
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
  templateUrl: './project-files.component.html',
  styleUrl: './project-files.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, TreeDragDropService],
})
export class ProjectFilesComponent {
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
  });

  protected readonly files = select(ProjectFilesSelectors.getFiles);
  protected readonly isFilesLoading = select(ProjectFilesSelectors.isFilesLoading);
  protected readonly currentFolder = select(ProjectFilesSelectors.getCurrentFolder);
  protected readonly provider = select(ProjectFilesSelectors.getProvider);

  protected readonly project = select(ProjectOverviewSelectors.getProject);
  protected readonly projectId = signal<string>('');
  private readonly rootFolders = select(ProjectFilesSelectors.getRootFolders);
  protected isRootFoldersLoading = select(ProjectFilesSelectors.isRootFoldersLoading);
  private readonly configuredStorageAddons = select(ProjectFilesSelectors.getConfiguredStorageAddons);
  protected isConfiguredStorageAddonsLoading = select(ProjectFilesSelectors.isConfiguredStorageAddonsLoading);
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

  protected readonly filesTreeActions: FilesTreeActions = {
    setCurrentFolder: (folder) => this.actions.setCurrentFolder(folder),
    setFilesIsLoading: (isLoading) => this.actions.setFilesIsLoading(isLoading),
    getFiles: (filesLink) => this.actions.getFiles(filesLink),
    deleteEntry: (projectId, link) => this.actions.deleteEntry(projectId, link),
    renameEntry: (projectId, link, newName) => this.actions.renameEntry(projectId, link, newName),
    setMoveFileCurrentFolder: (folder) => this.actions.setMoveFileCurrentFolder(folder),
  };

  constructor() {
    this.activeRoute.parent?.parent?.parent?.params.subscribe((params) => {
      if (params['id']) {
        this.projectId.set(params['id']);
        if (!this.project()) {
          this.filesTreeActions.setFilesIsLoading?.(true);
          this.actions.getProject(params['id']);
        }
      }
    });

    effect(() => {
      const project = this.project();

      if (project) {
        this.actions.getRootFolders(project.links.rootFolder);
        this.actions.getConfiguredStorageAddons(project.links.iri);
      }
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
            const fileId = event?.body?.data.id;
            approveFile(fileId, this.projectId());
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
        header: this.translateService.instant('project.files.dialogs.createFolder.title'),
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
    const projectId = this.projectId();
    const folderId = this.currentFolder()?.id ?? '';
    const isRootFolder = !this.currentFolder()?.relationships?.parentFolderLink;
    const provider = this.currentRootFolder()?.folder?.provider ?? 'osfstorage';

    if (projectId && folderId) {
      if (isRootFolder) {
        const link = this.filesService.getFolderDownloadLink(projectId, provider, '', true);
        window.open(link, '_blank')?.focus();
      } else {
        const link = this.filesService.getFolderDownloadLink(projectId, provider, folderId, false);
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
