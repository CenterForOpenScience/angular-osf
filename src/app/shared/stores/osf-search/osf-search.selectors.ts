import { Selector } from '@ngxs/store';

import { ResourceTab } from '@shared/enums';
import { StringOrNull } from '@shared/helpers';
import { DiscoverableFilter, Resource, SelectOption } from '@shared/models';

import { OsfSearchStateModel } from './osf-search.model';
import { OsfSearchState } from './osf-search.state';

export class OsfSearchSelectors {
  @Selector([OsfSearchState])
  static getResources(state: OsfSearchStateModel): Resource[] {
    return state.resources.data;
  }

  @Selector([OsfSearchState])
  static getResourcesLoading(state: OsfSearchStateModel): boolean {
    return state.resources.isLoading;
  }

  @Selector([OsfSearchState])
  static getResourcesCount(state: OsfSearchStateModel): number {
    return state.resourcesCount;
  }

  @Selector([OsfSearchState])
  static getSearchText(state: OsfSearchStateModel): StringOrNull {
    return state.searchText;
  }

  @Selector([OsfSearchState])
  static getSortBy(state: OsfSearchStateModel): string {
    return state.sortBy;
  }

  @Selector([OsfSearchState])
  static getResourceType(state: OsfSearchStateModel): ResourceTab {
    return state.resourceType;
  }

  @Selector([OsfSearchState])
  static getFirst(state: OsfSearchStateModel): string {
    return state.first;
  }

  @Selector([OsfSearchState])
  static getNext(state: OsfSearchStateModel): string {
    return state.next;
  }

  @Selector([OsfSearchState])
  static getPrevious(state: OsfSearchStateModel): string {
    return state.previous;
  }

  @Selector([OsfSearchState])
  static getFilters(state: OsfSearchStateModel): DiscoverableFilter[] {
    return state.filters;
  }

  @Selector([OsfSearchState])
  static getFilterValues(state: OsfSearchStateModel): Record<string, StringOrNull> {
    return state.filterValues;
  }

  @Selector([OsfSearchState])
  static getFilterOptionsCache(state: OsfSearchStateModel): Record<string, SelectOption[]> {
    return state.filterOptionsCache;
  }

  @Selector([OsfSearchState])
  static getFilterSearchCache(state: OsfSearchStateModel): Record<string, SelectOption[]> {
    return state.filterSearchCache;
  }

  @Selector([OsfSearchState])
  static getFilterPaginationCache(state: OsfSearchStateModel): Record<string, string> {
    return state.filterPaginationCache;
  }
}
