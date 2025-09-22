import { AsyncStateModel, RegistryProviderDetails } from '@shared/models';

export interface RegistrationProviderStateModel {
  currentBrandedProvider: AsyncStateModel<RegistryProviderDetails | null>;
}

export const REGISTRIES_PROVIDER_SEARCH_STATE_DEFAULTS: RegistrationProviderStateModel = {
  currentBrandedProvider: {
    data: null,
    isLoading: false,
    error: null,
  },
};
