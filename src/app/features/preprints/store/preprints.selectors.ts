import { Selector } from '@ngxs/store';

import { PreprintsState, PreprintsStateModel } from '@osf/features/preprints/store';

export class PreprintsSelectors {
  @Selector([PreprintsState])
  static getPreprintProviderDetails(providerId: string) {
    return (state: { preprints: PreprintsStateModel }) =>
      state.preprints.preprintProvidersDetails.data.find((provider) => provider.id.includes(providerId));
  }

  @Selector([PreprintsState])
  static isPreprintProviderDetailsLoading(state: PreprintsStateModel) {
    return state.preprintProvidersDetails.isLoading;
  }

  @Selector([PreprintsState])
  static getPreprintProvidersToAdvertise(state: PreprintsStateModel) {
    return state.preprintProvidersToAdvertise.data;
  }

  @Selector([PreprintsState])
  static getHighlightedSubjectsForProvider(providerId: string) {
    return (state: { preprints: PreprintsStateModel }) =>
      state.preprints.highlightedSubjectsForProvider.data.filter((subj) => subj.preprintProviderId === providerId);
  }

  @Selector([PreprintsState])
  static areSubjectsLoading(state: PreprintsStateModel) {
    return state.highlightedSubjectsForProvider.isLoading;
  }
}
