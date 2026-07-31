import { Selector } from '@ngxs/store';

import { CollectionsStateModel } from './collections.model';
import { CollectionsState } from './collections.state';

export class CollectionsSelectors {
  @Selector([CollectionsState])
  static getCollectionProvider(state: CollectionsStateModel) {
    return state.collectionProvider.data;
  }

  @Selector([CollectionsState])
  static getRequiredMetadataTemplate(state: CollectionsStateModel) {
    return state.collectionProvider.data?.requiredMetadataTemplate ?? null;
  }

  @Selector([CollectionsState])
  static getCollectionProviderLoading(state: CollectionsStateModel) {
    return state.collectionProvider.isLoading;
  }

  @Selector([CollectionsState])
  static getCurrentProjectSubmissions(state: CollectionsStateModel) {
    return state.currentProjectSubmissions.data;
  }

  @Selector([CollectionsState])
  static getCurrentProjectSubmissionsLoading(state: CollectionsStateModel) {
    return state.currentProjectSubmissions.isLoading;
  }

  @Selector([CollectionsState])
  static getUserCollectionSubmissions(state: CollectionsStateModel) {
    return state.userCollectionSubmissions.data;
  }
}
