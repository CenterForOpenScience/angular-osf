import { Selector } from '@ngxs/store';

import { RegistriesProviderSearchStateModel } from './registries-provider-search.model';
import { RegistriesProviderSearchState } from './registries-provider-search.state';

export class RegistriesProviderSearchSelectors {
  @Selector([RegistriesProviderSearchState])
  static getBrandedProvider(state: RegistriesProviderSearchStateModel) {
    return state.currentBrandedProvider.data;
  }

  @Selector([RegistriesProviderSearchState])
  static isBrandedProviderLoading(state: RegistriesProviderSearchStateModel) {
    return state.currentBrandedProvider.isLoading;
  }
}
