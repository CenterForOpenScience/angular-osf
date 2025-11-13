import { SupportedFeature } from '@osf/shared/enums/addon-supported-features.enum';
import { ConfiguredAddonModel } from '@osf/shared/models/addons/configured-addon.model';
import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';
import { FileDetailsModel, FileModel } from '@osf/shared/models/files/file.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { ResourceMetadata } from '@osf/shared/models/resource-metadata.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';
import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

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
