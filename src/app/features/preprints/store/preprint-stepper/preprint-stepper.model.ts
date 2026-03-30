import { IdNameModel } from '@osf/shared/models/common/id-name.model';
import { FileModel } from '@osf/shared/models/files/file.model';
import { FileFolderModel } from '@osf/shared/models/files/file-folder.model';
import { LicenseModel } from '@osf/shared/models/license/license.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';
import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

import { PreprintFileSource } from '../../enums';
import { PreprintFilesLinks, PreprintModel } from '../../models';

export interface PreprintStepperStateModel {
  preprint: AsyncStateModel<PreprintModel | null>;
  fileSource: PreprintFileSource;
  preprintFilesLinks: AsyncStateModel<PreprintFilesLinks | null>;
  preprintFile: AsyncStateModel<FileModel | null>;
  availableProjects: AsyncStateModel<IdNameModel[]>;
  projectFiles: AsyncStateWithTotalCount<FileModel[]>;
  licenses: AsyncStateModel<LicenseModel[]>;
  currentFolder: AsyncStateModel<FileFolderModel | null>;
  preprintProject: AsyncStateModel<IdNameModel | null>;
  hasBeenSubmitted: boolean;
  institutionsChanged: boolean;
}

export const DEFAULT_PREPRINT_STEPPER_STATE: PreprintStepperStateModel = {
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
    totalCount: 0,
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
