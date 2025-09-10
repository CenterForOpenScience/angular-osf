import { AsyncStateModel } from '@shared/models';

import { RegistryProviderDetails } from '../../models';

export interface RegistriesProviderSearchStateModel {
  currentBrandedProvider: AsyncStateModel<RegistryProviderDetails | null>;
}

export const REGISTRIES_PROVIDER_SEARCH_STATE_DEFAULTS: RegistriesProviderSearchStateModel = {
  currentBrandedProvider: {
    data: null,
    isLoading: false,
    error: null,
  },
};
