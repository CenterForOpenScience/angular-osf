import { AsyncStateWithTotalCount } from '@osf/shared/models';

import { Duplicate } from 'src/app/shared/models/duplicates';

export interface DuplicatesStateModel {
  related: AsyncStateWithTotalCount<Duplicate[]>;
}

export const DUPLICATES_DEFAULTS: DuplicatesStateModel = {
  related: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    totalCount: 0,
  },
};
