import { StringOrNull } from '@core/helpers';
import { PreprintFileSource } from '@osf/features/preprints/enums';
import { Preprint, PreprintFilesLinks } from '@osf/features/preprints/models';
import { ContributorModel } from '@shared/components/contributors/models';
import { AsyncStateModel, IdName, OsfFile, Subject } from '@shared/models';
import { License } from '@shared/models/license.model';

export interface SubmitPreprintStateModel {
  selectedProviderId: StringOrNull;
  createdPreprint: AsyncStateModel<Preprint | null>;
  fileSource: PreprintFileSource;
  preprintFilesLinks: AsyncStateModel<PreprintFilesLinks | null>;
  preprintFiles: AsyncStateModel<OsfFile[]>;
  availableProjects: AsyncStateModel<IdName[]>;
  projectFiles: AsyncStateModel<OsfFile[]>;
  contributors: AsyncStateModel<ContributorModel[]>;
  licenses: AsyncStateModel<License[]>;
  subjects: AsyncStateModel<Subject[]>;
  preprintProject: AsyncStateModel<IdName | null>;
}
