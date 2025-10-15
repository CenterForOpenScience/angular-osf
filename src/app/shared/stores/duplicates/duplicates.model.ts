import { AsyncStateWithTotalCount, NodeModel } from '@osf/shared/models';

export interface DuplicatesStateModel {
  duplicates: AsyncStateWithTotalCount<NodeModel[]>;
}

export const DUPLICATES_DEFAULTS: DuplicatesStateModel = {
  duplicates: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    totalCount: 0,
  },
};
