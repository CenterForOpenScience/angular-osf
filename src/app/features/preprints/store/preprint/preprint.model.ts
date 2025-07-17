import { Preprint, PreprintShortInfo } from '@osf/features/preprints/models';
import { AsyncStateModel, AsyncStateWithTotalCount } from '@shared/models';

export interface PreprintStateModel {
  myPreprints: AsyncStateWithTotalCount<PreprintShortInfo[]>;
  preprint: AsyncStateModel<Preprint | null>;
}

export const DefaultState: PreprintStateModel = {
  preprint: {
    data: null,
    isLoading: false,
    error: null,
    isSubmitting: false,
  },
  myPreprints: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
};
