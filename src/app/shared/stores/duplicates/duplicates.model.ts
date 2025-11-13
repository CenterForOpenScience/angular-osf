import { NodeModel } from '@osf/shared/models/nodes/base-node.model';
import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

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
