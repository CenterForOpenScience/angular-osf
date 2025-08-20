import { ContributorModel, OsfFile, ResourceMetadata } from '@shared/models';
import { ConfiguredStorageAddon } from '@shared/models/addons';
import { AsyncStateModel } from '@shared/models/store';

import { FileProvider } from '../constants';
import { OsfFileCustomMetadata, OsfFileRevision } from '../models';

export interface FilesStateModel {
  files: AsyncStateModel<OsfFile[]>;
  moveFileFiles: AsyncStateModel<OsfFile[]>;
  currentFolder: OsfFile | null;
  moveFileCurrentFolder: OsfFile | null;
  search: string;
  sort: string;
  provider: (typeof FileProvider)[keyof typeof FileProvider];
  openedFile: AsyncStateModel<OsfFile | null>;
  fileMetadata: AsyncStateModel<OsfFileCustomMetadata | null>;
  resourceMetadata: AsyncStateModel<ResourceMetadata | null>;
  contributors: AsyncStateModel<Partial<ContributorModel>[] | null>;
  fileRevisions: AsyncStateModel<OsfFileRevision[] | null>;
  tags: AsyncStateModel<string[]>;
  rootFolders: AsyncStateModel<OsfFile[] | null>;
  configuredStorageAddons: AsyncStateModel<ConfiguredStorageAddon[] | null>;
}

export const filesStateDefaults: FilesStateModel = {
  files: {
    data: [],
    isLoading: false,
    error: null,
  },
  moveFileFiles: {
    data: [],
    isLoading: false,
    error: null,
  },
  currentFolder: null,
  moveFileCurrentFolder: null,
  search: '',
  sort: 'name',
  provider: FileProvider.OsfStorage,
  openedFile: {
    data: null,
    isLoading: false,
    error: null,
  },
  fileMetadata: {
    data: null,
    isLoading: false,
    error: null,
  },
  resourceMetadata: {
    data: null,
    isLoading: false,
    error: null,
  },
  contributors: {
    data: null,
    isLoading: false,
    error: null,
  },
  fileRevisions: {
    data: null,
    isLoading: false,
    error: null,
  },
  tags: {
    data: [],
    isLoading: false,
    error: null,
  },
  rootFolders: {
    data: [],
    isLoading: true,
    error: null,
  },
  configuredStorageAddons: {
    data: [],
    isLoading: true,
    error: null,
  },
};
