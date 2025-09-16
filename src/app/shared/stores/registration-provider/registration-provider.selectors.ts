import { Selector } from '@ngxs/store';

import { RegistrationProviderStateModel } from './registration-provider.model';
import { RegistrationProviderState } from './registration-provider.state';

export class RegistrationProviderSelectors {
  @Selector([RegistrationProviderState])
  static getBrandedProvider(state: RegistrationProviderStateModel) {
    return state.currentBrandedProvider.data;
  }

  @Selector([RegistrationProviderState])
  static isBrandedProviderLoading(state: RegistrationProviderStateModel) {
    return state.currentBrandedProvider.isLoading;
  }
}
