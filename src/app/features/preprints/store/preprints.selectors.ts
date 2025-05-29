import { Selector } from '@ngxs/store';

import { PreprintsState, PreprintsStateModel } from '@osf/features/preprints/store';

export class PreprintsSelectors {
  @Selector([PreprintsState])
  static getPreprintProviderDetails(state: PreprintsStateModel) {
    return state.preprintProviderDetails.data;
  }

  @Selector([PreprintsState])
  static isPreprintProviderDetailsLoading(state: PreprintsStateModel) {
    return state.preprintProviderDetails.isLoading;
  }

  @Selector([PreprintsState])
  static getPreprintProvidersToAdvertise(state: PreprintsStateModel) {
    return state.preprintProvidersToAdvertise.data;
  }

  @Selector([PreprintsState])
  static getHighlightedSubjectsForProvider(state: PreprintsStateModel) {
    return state.highlightedSubjectsForProvider.data;
  }

  @Selector([PreprintsState])
  static areSubjectsLoading(state: PreprintsStateModel) {
    return state.highlightedSubjectsForProvider.isLoading;
  }
}
