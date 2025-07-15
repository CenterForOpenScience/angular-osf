import {
  FileProvider,
  OsfFileCustomMetadata,
  OsfFileProjectContributor,
  OsfFileRevision,
  OsfProjectMetadata,
} from '@osf/features/project/files/models';
import { OsfFile } from '@shared/models';
import { ConfiguredStorageAddon } from '@shared/models/addons';
import { AsyncStateModel } from '@shared/models/store';

export interface ProjectFilesStateModel {
  files: AsyncStateModel<OsfFile[]>;
  moveFileFiles: AsyncStateModel<OsfFile[]>;
  currentFolder: OsfFile | null;
  moveFileCurrentFolder: OsfFile | null;
  search: string;
  sort: string;
  provider: (typeof FileProvider)[keyof typeof FileProvider];
  openedFile: AsyncStateModel<OsfFile | null>;
  fileMetadata: AsyncStateModel<OsfFileCustomMetadata | null>;
  projectMetadata: AsyncStateModel<OsfProjectMetadata | null>;
  contributors: AsyncStateModel<OsfFileProjectContributor[] | null>;
  fileRevisions: AsyncStateModel<OsfFileRevision[] | null>;
  tags: AsyncStateModel<string[]>;
  rootFolders: AsyncStateModel<OsfFile[] | null>;
  configuredStorageAddons: AsyncStateModel<ConfiguredStorageAddon[] | null>;
}
