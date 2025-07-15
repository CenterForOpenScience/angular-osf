import { Preprint, PreprintShortInfo } from '@osf/features/preprints/models';
import { AsyncStateModel, AsyncStateWithTotalCount } from '@shared/models';

export interface PreprintStateModel {
  myPreprints: AsyncStateWithTotalCount<PreprintShortInfo[]>;
  preprint: AsyncStateModel<Preprint | null>;
}
