import { StringOrNull } from '@core/helpers';
import { PreprintFileSource } from '@osf/features/preprints/enums';
import { Preprint, PreprintFilesLinks } from '@osf/features/preprints/models';
import { AsyncStateModel, IdName, OsfFile } from '@shared/models';

export interface SubmitPreprintStateModel {
  selectedProviderId: StringOrNull;
  createdPreprint: Preprint | null;
  fileSource: PreprintFileSource;
  preprintFilesLinks: PreprintFilesLinks | null;
  preprintFiles: AsyncStateModel<OsfFile[]>;
  availableProjects: AsyncStateModel<IdName[]>;
  projectFiles: AsyncStateModel<OsfFile[]>;
}
