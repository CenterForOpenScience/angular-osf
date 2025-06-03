import {
  FileProvider,
  OsfFile,
  OsfFileCustomMetadata,
  OsfFileProjectContributor,
  OsfProjectMetadata,
} from '@osf/features/project/files/models';
import { AsyncStateModel } from '@shared/models/store';

export interface ProjectFilesStateModel {
  files: AsyncStateModel<OsfFile[]>;
  moveFileFiles: AsyncStateModel<OsfFile[]>;
  currentFolder?: OsfFile;
  moveFileCurrentFolder?: OsfFile;
  search: string;
  sort: string;
  provider: (typeof FileProvider)[keyof typeof FileProvider];
  openedFile: AsyncStateModel<OsfFile | null>;
  fileMetadata: AsyncStateModel<OsfFileCustomMetadata | null>;
  projectMetadata: AsyncStateModel<OsfProjectMetadata | null>;
  contributors: AsyncStateModel<OsfFileProjectContributor[] | null>;
}
