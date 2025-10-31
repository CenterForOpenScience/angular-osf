import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

import { RegistryResource } from '../../models';

export interface RegistryResourcesStateModel {
  resources: AsyncStateModel<RegistryResource[] | null>;
  currentResource: AsyncStateModel<RegistryResource | null>;
}

export const REGISTRY_RESOURCES_STATE_DEFAULTS = {
  resources: {
    data: null,
    isLoading: false,
    error: null,
  },
  currentResource: {
    data: null,
    isLoading: false,
    error: null,
  },
};
