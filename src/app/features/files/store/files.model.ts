import { SupportedFeature } from '@osf/shared/enums';
import { ContributorModel, FileDetailsModel, FileFolderModel, FileModel, ResourceMetadata } from '@shared/models';
import { ConfiguredAddonModel } from '@shared/models/addons';
import { AsyncStateModel, AsyncStateWithTotalCount } from '@shared/models/store';

import { FileProvider } from '../constants';
import { OsfFileCustomMetadata, OsfFileRevision } from '../models';

export interface FilesStateModel {
  files: AsyncStateWithTotalCount<FileModel[]>;
  moveDialogFiles: AsyncStateWithTotalCount<FileModel[]>;
  currentFolder: FileFolderModel | null;
  moveDialogCurrentFolder: FileFolderModel | null;
  search: string;
  sort: string;
  provider: (typeof FileProvider)[keyof typeof FileProvider];
  openedFile: AsyncStateModel<FileDetailsModel | null>;
  fileMetadata: AsyncStateModel<OsfFileCustomMetadata | null>;
  resourceMetadata: AsyncStateModel<ResourceMetadata | null>;
  contributors: AsyncStateModel<ContributorModel[] | null>;
  fileRevisions: AsyncStateModel<OsfFileRevision[] | null>;
  tags: AsyncStateModel<string[]>;
  rootFolders: AsyncStateModel<FileFolderModel[] | null>;
  moveDialogRootFolders: AsyncStateModel<FileFolderModel[] | null>;
  configuredStorageAddons: AsyncStateModel<ConfiguredAddonModel[] | null>;
  moveDialogConfiguredStorageAddons: AsyncStateModel<ConfiguredAddonModel[] | null>;
  isAnonymous: boolean;
  storageSupportedFeatures: Record<string, SupportedFeature[]>;
}

export const FILES_STATE_DEFAULTS: FilesStateModel = {
  files: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
  moveDialogFiles: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
  currentFolder: null,
  moveDialogCurrentFolder: null,
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
  moveDialogRootFolders: {
    data: [],
    isLoading: true,
    error: null,
  },
  moveDialogConfiguredStorageAddons: {
    data: [],
    isLoading: true,
    error: null,
  },
  isAnonymous: false,
  storageSupportedFeatures: {
    [FileProvider.OsfStorage]: [
      SupportedFeature.AddUpdateFiles,
      SupportedFeature.DeleteFiles,
      SupportedFeature.DownloadAsZip,
      SupportedFeature.FileVersions,
      SupportedFeature.CopyInto,
    ],
  },
};
