import { createDispatchMap, select } from '@ngxs/store';

import { TranslatePipe } from '@ngx-translate/core';

import { Button } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { FileProvider } from '@osf/features/files/constants';
import {
  FilesSelectors,
  GetConfiguredStorageAddons,
  GetFiles,
  GetRootFolders,
  ResetState,
  SetCurrentFolder,
} from '@osf/features/files/store';
import { FilesTreeComponent } from '@osf/shared/components/files-tree/files-tree.component';
import { SelectComponent } from '@osf/shared/components/select/select.component';
import { Primitive } from '@osf/shared/helpers/types.helper';
import { getViewOnlyParamFromUrl, hasViewOnlyParam } from '@osf/shared/helpers/view-only.helper';
import { ConfiguredAddonModel } from '@osf/shared/models/addons/configured-addon.model';
import { FileModel } from '@osf/shared/models/files/file.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { FileLabelModel } from '@osf/shared/models/files/file-label.model';
import { NodeShortInfoModel } from '@osf/shared/models/nodes/node-with-children.model';
import { ProjectModel } from '@osf/shared/models/projects/projects.models';
import { SelectOption } from '@osf/shared/models/select-option.model';

@Component({
  selector: 'osf-files-widget',
  imports: [TranslatePipe, SelectComponent, TabsModule, FilesTreeComponent, Button, Skeleton],
  templateUrl: './files-widget.component.html',
  styleUrl: './files-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilesWidgetComponent {
  rootOption = input.required<SelectOption>();
  components = input.required<NodeShortInfoModel[]>();
  areComponentsLoading = input<boolean>(false);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);

  private readonly environment = inject(ENVIRONMENT);
  private readonly destroyRef = inject(DestroyRef);

  readonly files = select(FilesSelectors.getFiles);
  readonly filesTotalCount = select(FilesSelectors.getFilesTotalCount);
  readonly isFilesLoading = select(FilesSelectors.isFilesLoading);
  readonly currentFolder = select(FilesSelectors.getCurrentFolder);
  readonly provider = select(FilesSelectors.getProvider);
  readonly rootFolders = select(FilesSelectors.getRootFolders);
  readonly isRootFoldersLoading = select(FilesSelectors.isRootFoldersLoading);
  readonly configuredStorageAddons = select(FilesSelectors.getConfiguredStorageAddons);
  readonly isConfiguredStorageAddonsLoading = select(FilesSelectors.isConfiguredStorageAddonsLoading);

  currentRootFolder = model<FileLabelModel | null>(null);
  pageNumber = signal(1);

  readonly osfStorageLabel = 'OSF Storage';

  readonly options = computed(() => {
    const components = this.components().filter((component) => this.rootOption().value !== component.id);
    return [this.rootOption(), ...this.buildOptions(components)];
  });

  readonly storageAddons = computed(() => {
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

  readonly hasViewOnly = computed(() => hasViewOnlyParam(this.router));

  private readonly actions = createDispatchMap({
    getFiles: GetFiles,
    setCurrentFolder: SetCurrentFolder,
    getRootFolders: GetRootFolders,
    getConfiguredStorageAddons: GetConfiguredStorageAddons,
    resetState: ResetState,
  });

  get isStorageLoading() {
    return this.isConfiguredStorageAddonsLoading() || this.isRootFoldersLoading();
  }

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
            label: this.osfStorageLabel,
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
      this.actions.resetState();
    });
  }

  private getStorageAddons(projectId: string) {
    const resourcePath = 'nodes';
    const folderLink = `${this.environment.apiDomainUrl}/v2/${resourcePath}/${projectId}/files/`;
    const iriLink = `${this.environment.webUrl}/${projectId}`;
    this.actions.getRootFolders(folderLink);
    this.actions.getConfiguredStorageAddons(iriLink);
  }

  private flatComponents(
    components: (Partial<ProjectModel> & { children?: ProjectModel[] })[] = [],
    parentPath = '..'
  ): SelectOption[] {
    return components.flatMap((component) => {
      const currentPath = parentPath ? `${parentPath}/${component.title ?? ''}` : (component.title ?? '');

      return [
        {
          value: component.id ?? '',
          label: currentPath,
        },
        ...this.flatComponents(component.children ?? [], currentPath),
      ];
    });
  }

  private buildOptions(nodes: NodeShortInfoModel[] = [], parentPath = '..'): SelectOption[] {
    return nodes.reduce<SelectOption[]>((acc, node) => {
      const pathParts: string[] = [];

      let current: NodeShortInfoModel | undefined = node;
      while (current) {
        pathParts.unshift(current.title ?? '');
        current = nodes.find((n) => n.id === current?.parentId);
      }

      const fullPath = parentPath ? `${parentPath}/${pathParts.join('/')}` : pathParts.join('/');

      acc.push({
        value: node.id,
        label: fullPath,
      });

      return acc;
    }, []);
  }

  private getAddonName(addons: ConfiguredAddonModel[], provider: string): string {
    if (provider === FileProvider.OsfStorage) {
      return this.osfStorageLabel;
    } else {
      return addons.find((addon) => addon.externalServiceName === provider)?.displayName ?? '';
    }
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
    const extras = this.hasViewOnly()
      ? { queryParams: { view_only: getViewOnlyParamFromUrl(this.router.url) } }
      : undefined;

    const url = this.router.serializeUrl(this.router.createUrlTree(['/', file.guid], extras));

    window.open(url, '_blank');
  }

  onLoadFiles(event: { link: string; page: number }) {
    this.actions.getFiles(event.link, event.page);
  }

  setCurrentFolder(folder: FileFolderModel) {
    this.actions.setCurrentFolder(folder);
  }
}
