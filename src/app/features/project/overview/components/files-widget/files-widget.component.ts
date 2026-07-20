import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';

import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { FileProvider } from '@osf/features/files/constants';
import {
  FilesSelectors,
  GetConfiguredStorageAddons,
  GetFiles,
  GetRootFolders,
  ResetFilesState,
  SetFilesCurrentFolder,
} from '@osf/features/files/store';
import { FilesTreeComponent } from '@osf/shared/components/files-tree/files-tree.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { CurrentResourceType, ResourceType } from '@osf/shared/enums/resource-type.enum';
import { buildProjectPathOptions } from '@osf/shared/helpers/project-path-options.helper';
import { mapRootFoldersToStorageLabels } from '@osf/shared/helpers/storage-addon-options.helper';
import { Primitive } from '@osf/shared/helpers/types.helper';
import { FileModel } from '@osf/shared/models/files/file.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { FileLabelModel } from '@osf/shared/models/files/file-label.model';
import { FilePageLinkModel } from '@osf/shared/models/files/file-page-link.model';
import { NodeShortInfoModel } from '@osf/shared/models/nodes/node-with-children.model';
import { SelectOption } from '@osf/shared/models/select-option.model';
import { FileDownloadService } from '@osf/shared/services/file-download.service';
import { FilesService } from '@osf/shared/services/files.service';
import { ViewOnlyLinkHelperService } from '@osf/shared/services/view-only-link-helper.service';

@Component({
  selector: 'osf-files-widget',
  imports: [Button, TranslatePipe, SelectComponent, TabsModule, FilesTreeComponent, Skeleton],
  templateUrl: './files-widget.component.html',
  styleUrl: './files-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesWidgetComponent {
  readonly rootOption = input.required<SelectOption>();
  readonly components = input.required<NodeShortInfoModel[]>();
  readonly areComponentsLoading = input<boolean>(false);

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewOnlyService = inject(ViewOnlyLinkHelperService);
  private readonly filesService = inject(FilesService);
  private readonly fileDownloadService = inject(FileDownloadService);
  private readonly translateService = inject(TranslateService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly files = select(FilesSelectors.getFiles);
  readonly filesTotalCount = select(FilesSelectors.getFilesTotalCount);
  readonly isFilesLoading = select(FilesSelectors.isFilesLoading);
  readonly currentFolder = select(FilesSelectors.getCurrentFolder);
  readonly rootFolders = select(FilesSelectors.getRootFolders);
  readonly isRootFoldersLoading = select(FilesSelectors.isRootFoldersLoading);
  readonly configuredStorageAddons = select(FilesSelectors.getConfiguredStorageAddons);
  readonly isConfiguredStorageAddonsLoading = select(FilesSelectors.isConfiguredStorageAddonsLoading);

  currentRootFolder = model<FileLabelModel | null>(null);
  pageNumber = signal(1);

  readonly options = computed(() => {
    const components = this.components().filter((component) => this.rootOption().value !== component.id);
    return [this.rootOption(), ...buildProjectPathOptions({ nodes: components })];
  });

  readonly storageAddons = computed(() => {
    const osfLabel = this.translateService.instant('files.storageLocation');
    return mapRootFoldersToStorageLabels(this.rootFolders(), this.configuredStorageAddons(), osfLabel);
  });

  readonly hasViewOnly = computed(() => this.viewOnlyService.hasViewOnlyParam(this.router));

  private readonly actions = createDispatchMap({
    getFiles: GetFiles,
    setCurrentFolder: SetFilesCurrentFolder,
    getRootFolders: GetRootFolders,
    getConfiguredStorageAddons: GetConfiguredStorageAddons,
    resetState: ResetFilesState,
  });

  readonly isStorageLoading = computed(() => this.isConfiguredStorageAddonsLoading() || this.isRootFoldersLoading());
  readonly isButtonDisabled = computed(
    () => this.isFilesLoading() || this.isStorageLoading() || this.filesTotalCount() === 0
  );

  selectedRoot: string | null = null;

  constructor() {
    effect(() => {
      const rootOption = this.rootOption();
      if (rootOption) {
        this.selectedRoot = rootOption.value as string;
      }
    });

    effect(() => {
      const projectId = this.rootOption().value;
      this.getStorageAddons(projectId as string);
    });

    effect(() => {
      const rootFolders = this.rootFolders();
      if (rootFolders) {
        const osfRootFolder = rootFolders.find((folder) => folder.provider === FileProvider.OsfStorage);
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
        this.actions.setCurrentFolder(currentRootFolder.folder);
      }
    });

    effect(() => {
      const currentFolder = this.currentFolder();
      if (currentFolder) {
        this.pageNumber.set(1);
        const filesLink = currentFolder.links?.filesLink ?? '';
        this.actions.getFiles(filesLink, 1);
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.isBrowser) {
        this.actions.resetState();
      }
    });
  }

  private getStorageAddons(projectId: string) {
    this.actions.getRootFolders(projectId, ResourceType.Project);
    this.actions.getConfiguredStorageAddons(projectId);
  }

  onChangeProject(value: Primitive) {
    this.getStorageAddons(value as string);
  }

  onStorageChange(value: Primitive) {
    const folder = this.storageAddons().find((option) => option.folder.id === value);
    if (folder) {
      this.currentRootFolder.set(folder);
    }
  }

  navigateToFile(file: FileModel) {
    if (file.guid) {
      this.openFile(file.guid);
      return;
    }

    this.filesService
      .getFileGuid(file.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((file) => {
        if (file.guid) {
          this.openFile(file.guid);
        }
      });
  }

  downloadFolder(): void {
    this.fileDownloadService.downloadFolderAsZip({
      resourceId: this.selectedRoot ?? '',
      resourceType: CurrentResourceType.Projects,
      downloadLink: this.currentFolder()?.links.download ?? '',
    });
  }

  onLoadFiles(event: FilePageLinkModel) {
    this.actions.getFiles(event.link, event.page);
  }

  setCurrentFolder(folder: FileFolderModel) {
    this.actions.setCurrentFolder(folder);
  }

  private openFile(guid: string): void {
    const extras = this.hasViewOnly()
      ? { queryParams: { view_only: this.viewOnlyService.getViewOnlyParamFromUrl(this.router.url) } }
      : undefined;

    window.open(this.router.serializeUrl(this.router.createUrlTree(['/', guid], extras)), '_blank');
  }
}
