import { Selector } from '@ngxs/store';

import { PreprintProvidersState, PreprintProvidersStateModel } from '@osf/features/preprints/store/preprint-providers';

export class PreprintProvidersSelectors {
  @Selector([PreprintProvidersState])
  static getPreprintProviderDetails(providerId: string) {
    return (state: { preprintProviders: PreprintProvidersStateModel }) =>
      state.preprintProviders.preprintProvidersDetails.data.find((provider) => provider.id.includes(providerId));
  }

  @Selector([PreprintProvidersState])
  static isPreprintProviderDetailsLoading(state: PreprintProvidersStateModel) {
    return state.preprintProvidersDetails.isLoading;
  }

  @Selector([PreprintProvidersState])
  static getPreprintProvidersToAdvertise(state: PreprintProvidersStateModel) {
    return state.preprintProvidersToAdvertise.data;
  }

  @Selector([PreprintProvidersState])
  static getPreprintProvidersAllowingSubmissions(state: PreprintProvidersStateModel) {
    return state.preprintProvidersAllowingSubmissions.data;
  }

  @Selector([PreprintProvidersState])
  static arePreprintProvidersAllowingSubmissionsLoading(state: PreprintProvidersStateModel) {
    return state.preprintProvidersAllowingSubmissions.isLoading;
  }

  @Selector([PreprintProvidersState])
  static getHighlightedSubjectsForProvider(state: PreprintProvidersStateModel) {
    return state.highlightedSubjectsForProvider.data;
  }

  @Selector([PreprintProvidersState])
  static areSubjectsLoading(state: PreprintProvidersStateModel) {
    return state.highlightedSubjectsForProvider.isLoading;
  }
}
