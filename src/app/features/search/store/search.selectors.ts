import { Selector } from '@ngxs/store';

import { ResourceTab } from '@osf/shared/enums';
import { DiscoverableFilter, Resource, SelectOption } from '@osf/shared/models';

import { SearchStateModel } from './search.model';
import { SearchState } from './search.state';

export class SearchSelectors {
  @Selector([SearchState])
  static getResources(state: SearchStateModel): Resource[] {
    return state.resources.data;
  }

  @Selector([SearchState])
  static getResourcesCount(state: SearchStateModel): number {
    return state.resourcesCount;
  }

  @Selector([SearchState])
  static getSearchText(state: SearchStateModel): string {
    return state.searchText;
  }

  @Selector([SearchState])
  static getSortBy(state: SearchStateModel): string {
    return state.sortBy;
  }

  @Selector([SearchState])
  static getResourceTab(state: SearchStateModel): ResourceTab {
    return state.resourceTab;
  }

  @Selector([SearchState])
  static getFirst(state: SearchStateModel): string {
    return state.first;
  }

  @Selector([SearchState])
  static getNext(state: SearchStateModel): string {
    return state.next;
  }

  @Selector([SearchState])
  static getPrevious(state: SearchStateModel): string {
    return state.previous;
  }

  @Selector([SearchState])
  static getResourcesLoading(state: SearchStateModel): boolean {
    return state.resources.isLoading;
  }

  @Selector([SearchState])
  static getFilters(state: SearchStateModel): DiscoverableFilter[] {
    return state.filters;
  }

  @Selector([SearchState])
  static getFilterValues(state: SearchStateModel): Record<string, string | null> {
    return state.filterValues;
  }

  @Selector([SearchState])
  static getFilterOptionsCache(state: SearchStateModel): Record<string, SelectOption[]> {
    return state.filterOptionsCache;
  }

  @Selector([SearchState])
  static getFilterSearchCache(state: SearchStateModel): Record<string, SelectOption[]> {
    return state.filterSearchCache;
  }

  @Selector([SearchState])
  static getFilterPaginationCache(state: SearchStateModel): Record<string, string> {
    return state.filterPaginationCache;
  }
}
