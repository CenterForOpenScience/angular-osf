import { Selector } from '@ngxs/store';

import { ResourceType } from '@shared/enums';
import { StringOrNull } from '@shared/helpers';
import { DiscoverableFilter, Resource, SelectOption } from '@shared/models';

import { GlobalSearchStateModel } from './global-search.model';
import { GlobalSearchState } from './global-search.state';

export class GlobalSearchSelectors {
  @Selector([GlobalSearchState])
  static getResources(state: GlobalSearchStateModel): Resource[] {
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
  static getSelf(state: GlobalSearchStateModel): string {
    return state.self;
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
  static getFilterValues(state: GlobalSearchStateModel): Record<string, StringOrNull> {
    return state.filterValues;
  }

  @Selector([GlobalSearchState])
  static getFilterOptionsCache(state: GlobalSearchStateModel): Record<string, SelectOption[]> {
    return state.filterOptionsCache;
  }

  @Selector([GlobalSearchState])
  static getFilterSearchCache(state: GlobalSearchStateModel): Record<string, SelectOption[]> {
    return state.filterSearchCache;
  }

  @Selector([GlobalSearchState])
  static getFilterPaginationCache(state: GlobalSearchStateModel): Record<string, string> {
    return state.filterPaginationCache;
  }
}
