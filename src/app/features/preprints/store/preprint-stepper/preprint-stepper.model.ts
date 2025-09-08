import { PreprintFileSource } from '@osf/features/preprints/enums';
import { Preprint, PreprintFilesLinks } from '@osf/features/preprints/models';
import { StringOrNull } from '@shared/helpers';
import { AsyncStateModel, IdName, OsfFile } from '@shared/models';
import { LicenseModel } from '@shared/models/license.model';

export interface PreprintStepperStateModel {
  selectedProviderId: StringOrNull;
  preprint: AsyncStateModel<Preprint | null>;
  fileSource: PreprintFileSource;
  preprintFilesLinks: AsyncStateModel<PreprintFilesLinks | null>;
  preprintFiles: AsyncStateModel<OsfFile[]>;
  availableProjects: AsyncStateModel<IdName[]>;
  projectFiles: AsyncStateModel<OsfFile[]>;
  licenses: AsyncStateModel<LicenseModel[]>;
  currentFolder: OsfFile | null;
  preprintProject: AsyncStateModel<IdName | null>;
  hasBeenSubmitted: boolean;
}
