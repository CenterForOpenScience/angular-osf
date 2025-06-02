import { OsfFile } from '@osf/features/project/files/models';
import { FileProvider } from '@osf/features/project/files/models/data/file-provider.const';
import { OsfFileCustomMetadata } from '@osf/features/project/files/models/osf-models/file-custom-metafata.model';
import { OsfFileProjectContributor } from '@osf/features/project/files/models/osf-models/file-project-contributor.model';
import { OsfProjectMetadata } from '@osf/features/project/files/models/osf-models/project-custom-metadata.model';
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
