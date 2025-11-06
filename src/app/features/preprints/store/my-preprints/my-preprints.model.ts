import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

import { PreprintShortInfo } from '../../models';

export interface MyPreprintsStateModel {
  myPreprints: AsyncStateWithTotalCount<PreprintShortInfo[]>;
}

export const DEFAULT_MY_PREPRINTS_STATE: MyPreprintsStateModel = {
  myPreprints: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
};
