import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';
import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

import { RegistryResource } from '../../models';

export interface RegistryResourcesStateModel {
  resources: AsyncStateWithTotalCount<RegistryResource[] | null>;
  currentResource: AsyncStateModel<RegistryResource | null>;
  currentPage: number;
}

export const REGISTRY_RESOURCES_STATE_DEFAULTS = {
  resources: {
    data: null,
    isLoading: false,
    error: null,
    totalCount: 0,
  },
  currentResource: {
    data: null,
    isLoading: false,
    error: null,
  },
  currentPage: 1,
};
