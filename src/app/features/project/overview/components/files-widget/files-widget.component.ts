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

import { FileProvider } from '@osf/features/files/constants';
import {
  FilesSelectors,
  GetConfiguredStorageAddons,
  GetFiles,
  GetRootFolders,
  ResetState,
  SetCurrentFolder,
  SetFilesIsLoading,
} from '@osf/features/files/store';
import { FilesTreeComponent, SelectComponent } from '@osf/shared/components';
import { Primitive } from '@osf/shared/helpers';
import {
  ConfiguredStorageAddonModel,
  FileLabelModel,
  FilesTreeActions,
  NodeShortInfoModel,
  OsfFile,
  SelectOption,
} from '@osf/shared/models';
import { Project } from '@osf/shared/models/projects';

import { environment } from 'src/environments/environment';

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

  readonly osfStorageLabel = 'Osf Storage';

  readonly options = computed(() => {
    const components = this.components().filter((component) => this.rootOption().value !== component.id);
    return [this.rootOption(), ...this.buildOptions(components).reverse()];
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

  private readonly actions = createDispatchMap({
    getFiles: GetFiles,
    setCurrentFolder: SetCurrentFolder,
    setFilesIsLoading: SetFilesIsLoading,
    getRootFolders: GetRootFolders,
    getConfiguredStorageAddons: GetConfiguredStorageAddons,
    resetState: ResetState,
  });

  readonly filesTreeActions: FilesTreeActions = {
    setCurrentFolder: (folder) => this.actions.setCurrentFolder(folder),
    getFiles: (filesLink) => this.actions.getFiles(filesLink, this.pageNumber()),
    setFilesIsLoading: (isLoading) => this.actions.setFilesIsLoading(isLoading),
  };

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
      this.destroyRef.onDestroy(() => {
        this.actions.resetState();
      });
    });
  }

  private getStorageAddons(projectId: string) {
    const resourcePath = 'nodes';
    const folderLink = `${environment.apiDomainUrl}/v2/${resourcePath}/${projectId}/files/`;
    const iriLink = `${environment.webUrl}/${projectId}`;
    this.actions.getRootFolders(folderLink);
    this.actions.getConfiguredStorageAddons(iriLink);
  }

  private flatComponents(
    components: (Partial<Project> & { children?: Project[] })[] = [],
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

  private getAddonName(addons: ConfiguredStorageAddonModel[], provider: string): string {
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

  navigateToFile(file: OsfFile) {
    this.router.navigate(['files', file.guid], { relativeTo: this.activeRoute.parent });
  }

  onFilesPageChange(page: number) {
    this.pageNumber.set(page);
  }
}
