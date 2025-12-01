import { StringOrNull } from '@osf/shared/helpers/types.helper';
import { IdNameModel } from '@osf/shared/models/common/id-name.model';
import { FileModel } from '@osf/shared/models/files/file.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { LicenseModel } from '@osf/shared/models/license/license.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

import { PreprintFileSource } from '../../enums';
import { PreprintFilesLinks, PreprintModel } from '../../models';

export interface PreprintStepperStateModel {
  selectedProviderId: StringOrNull;
  preprint: AsyncStateModel<PreprintModel | null>;
  fileSource: PreprintFileSource;
  preprintFilesLinks: AsyncStateModel<PreprintFilesLinks | null>;
  preprintFile: AsyncStateModel<FileModel | null>;
  availableProjects: AsyncStateModel<IdNameModel[]>;
  projectFiles: AsyncStateModel<FileModel[]>;
  licenses: AsyncStateModel<LicenseModel[]>;
  currentFolder: AsyncStateModel<FileFolderModel | null>;
  preprintProject: AsyncStateModel<IdNameModel | null>;
  hasBeenSubmitted: boolean;
  institutionsChanged: boolean;
}

export const DEFAULT_PREPRINT_STEPPER_STATE: PreprintStepperStateModel = {
  selectedProviderId: null,
  preprint: {
    data: null,
    isLoading: false,
    error: null,
    isSubmitting: false,
  },
  fileSource: PreprintFileSource.None,
  preprintFilesLinks: {
    data: null,
    isLoading: false,
    error: null,
  },
  preprintFile: {
    data: null,
    isLoading: false,
    error: null,
  },
  availableProjects: {
    data: [],
    isLoading: false,
    error: null,
  },
  projectFiles: {
    data: [],
    isLoading: false,
    error: null,
  },
  licenses: {
    data: [],
    isLoading: false,
    error: null,
  },
  preprintProject: {
    data: null,
    isLoading: false,
    error: null,
  },
  hasBeenSubmitted: false,
  currentFolder: {
    data: null,
    isLoading: false,
    error: null,
  },
  institutionsChanged: false,
};
