import { Selector } from '@ngxs/store';

import { ResourceType } from '@osf/shared/enums';
import { StringOrNull } from '@osf/shared/helpers';
import { DiscoverableFilter, FilterOption, ResourceModel } from '@osf/shared/models';

import { GlobalSearchStateModel } from './global-search.model';
import { GlobalSearchState } from './global-search.state';

export class GlobalSearchSelectors {
  @Selector([GlobalSearchState])
  static getResources(state: GlobalSearchStateModel): ResourceModel[] {
    return state.resources.data;
  }

  @Selector([GlobalSearchState])
  static getResourcesLoading(state: GlobalSearchStateModel): boolean {
    return state.resources.isLoading;
  }

  @Selector([GlobalSearchState])
  static getResourcesCount(state: GlobalSearchStateModel): number {
    return state.resourcesCount;
  }

  @Selector([GlobalSearchState])
  static getSearchText(state: GlobalSearchStateModel): StringOrNull {
    return state.searchText;
  }

  @Selector([GlobalSearchState])
  static getSortBy(state: GlobalSearchStateModel): string {
    return state.sortBy;
  }

  @Selector([GlobalSearchState])
  static getResourceType(state: GlobalSearchStateModel): ResourceType {
    return state.resourceType;
  }

  @Selector([GlobalSearchState])
  static getFirst(state: GlobalSearchStateModel): StringOrNull {
    return state.first;
  }

  @Selector([GlobalSearchState])
  static getNext(state: GlobalSearchStateModel): StringOrNull {
    return state.next;
  }

  @Selector([GlobalSearchState])
  static getPrevious(state: GlobalSearchStateModel): StringOrNull {
    return state.previous;
  }

  @Selector([GlobalSearchState])
  static getFilters(state: GlobalSearchStateModel): DiscoverableFilter[] {
    return state.filters;
  }

  @Selector([GlobalSearchState])
  static getSelectedOptions(state: GlobalSearchStateModel): Record<string, FilterOption[]> {
    return state.selectedFilterOptions;
  }

  @Selector([GlobalSearchState])
  static getFilterOptionsCache(state: GlobalSearchStateModel): Record<string, FilterOption[]> {
    return state.filterOptionsCache;
  }

  @Selector([GlobalSearchState])
  static getFilterSearchCache(state: GlobalSearchStateModel): Record<string, FilterOption[]> {
    return state.filterSearchCache;
  }

  @Selector([GlobalSearchState])
  static getFilterPaginationCache(state: GlobalSearchStateModel): Record<string, string> {
    return state.filterPaginationCache;
  }
}
