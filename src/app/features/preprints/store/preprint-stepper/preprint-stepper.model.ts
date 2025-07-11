import { StringOrNull } from '@core/helpers';
import { PreprintFileSource } from '@osf/features/preprints/enums';
import { Preprint, PreprintFilesLinks } from '@osf/features/preprints/models';
import { AsyncStateModel, IdName, OsfFile } from '@shared/models';
import { License } from '@shared/models/license.model';

export interface PreprintStepperStateModel {
  selectedProviderId: StringOrNull;
  createdPreprint: AsyncStateModel<Preprint | null>;
  fileSource: PreprintFileSource;
  preprintFilesLinks: AsyncStateModel<PreprintFilesLinks | null>;
  preprintFiles: AsyncStateModel<OsfFile[]>;
  availableProjects: AsyncStateModel<IdName[]>;
  projectFiles: AsyncStateModel<OsfFile[]>;
  licenses: AsyncStateModel<License[]>;
  preprintProject: AsyncStateModel<IdName | null>;
  hasBeenSubmitted: boolean;
}
