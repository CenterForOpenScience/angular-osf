import { Selector } from '@ngxs/store';

import { CollectionsFilters } from '@shared/models';

import { CollectionsStateModel } from './collections.model';
import { CollectionsState } from './collections.state';

export class CollectionsSelectors {
  @Selector([CollectionsState])
  static getAllSelectedFilters(state: CollectionsStateModel): CollectionsFilters {
    return state.currentFilters;
  }

  @Selector([CollectionsState])
  static getAllFiltersOptions(state: CollectionsStateModel): CollectionsFilters {
    return state.filtersOptions;
  }

  @Selector([CollectionsState])
  static getCollectionProvider(state: CollectionsStateModel) {
    return state.collectionProvider.data;
  }

  @Selector([CollectionsState])
  static getCollectionDetails(state: CollectionsStateModel) {
    return state.collectionDetails.data;
  }

  @Selector([CollectionsState])
  static getCollectionProviderLoading(state: CollectionsStateModel) {
    return state.collectionProvider.isLoading;
  }

  @Selector([CollectionsState])
  static getCollectionDetailsLoading(state: CollectionsStateModel) {
    return state.collectionDetails.isLoading;
  }

  @Selector([CollectionsState])
  static getCollectionSubmissionsSearchResult(state: CollectionsStateModel) {
    return state.collectionSubmissions.data;
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
  static getCollectionSubmissionsLoading(state: CollectionsStateModel) {
    return state.collectionSubmissions.isLoading;
  }

  @Selector([CollectionsState])
  static getUserCollectionSubmissions(state: CollectionsStateModel) {
    return state.userCollectionSubmissions.data;
  }

  @Selector([CollectionsState])
  static getUserCollectionSubmissionsLoading(state: CollectionsStateModel) {
    return state.userCollectionSubmissions.isLoading;
  }

  @Selector([CollectionsState])
  static getSortBy(state: CollectionsStateModel) {
    return state.sortBy;
  }

  @Selector([CollectionsState])
  static getSearchText(state: CollectionsStateModel) {
    return state.searchText;
  }

  @Selector([CollectionsState])
  static getPageNumber(state: CollectionsStateModel) {
    return state.page;
  }

  @Selector([CollectionsState])
  static getTotalSubmissions(state: CollectionsStateModel) {
    return state.totalSubmissions;
  }
}
