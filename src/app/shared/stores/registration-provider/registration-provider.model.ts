import { RegistryProviderDetails } from '@osf/shared/models/provider/registry-provider.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

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
