import { Action, State, StateContext } from '@ngxs/store';

import { Observable, tap } from 'rxjs';

import { Injectable } from '@angular/core';

import { ResourcesData } from '@osf/features/search/models';
import { getResourceTypes } from '@osf/shared/helpers';
import { searchStateDefaults } from '@shared/constants';
import { BaseSearchState } from '@shared/stores/base-search';

import {
  ClearFilterSearchResults,
  GetResources,
  GetResourcesByLink,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  LoadFilterOptionsWithSearch,
  LoadMoreFilterOptions,
  SetResourceType,
  SetSortBy,
  UpdateFilterValue,
} from './search.actions';
import { SearchStateModel } from './search.model';

@Injectable()
@State<SearchStateModel>({
  name: 'search',
  defaults: searchStateDefaults,
})
export class SearchState extends BaseSearchState<SearchStateModel> {
  @Action(GetResources)
  getResources(ctx: StateContext<SearchStateModel>): Observable<ResourcesData> {
    const state = ctx.getState();
    ctx.patchState({ resources: { ...state.resources, isLoading: true } });
    const filtersParams = this.buildFiltersParams(state);
    const searchText = state.searchText;
    const sortBy = state.sortBy;
    const resourceTab = state.resourceType;
    const resourceTypes = getResourceTypes(resourceTab);

    return this.searchService
      .getResources(filtersParams, searchText, sortBy, resourceTypes)
      .pipe(tap((response) => this.updateResourcesState(ctx, response)));
  }

  @Action(GetResourcesByLink)
  getResourcesByLink(ctx: StateContext<SearchStateModel>, action: GetResourcesByLink) {
    return this.handleFetchResourcesByLink(ctx, action.link);
  }

  @Action(LoadFilterOptions)
  loadFilterOptions(ctx: StateContext<SearchStateModel>, action: LoadFilterOptions) {
    return this.handleLoadFilterOptions(ctx, action.filterKey);
  }

  @Action(LoadMoreFilterOptions)
  loadMoreFilterOptions(ctx: StateContext<SearchStateModel>, action: LoadMoreFilterOptions) {
    return this.handleLoadMoreFilterOptions(ctx, action.filterKey);
  }

  @Action(LoadFilterOptionsWithSearch)
  loadFilterOptionsWithSearch(ctx: StateContext<SearchStateModel>, action: LoadFilterOptionsWithSearch) {
    return this.handleLoadFilterOptionsWithSearch(ctx, action.filterKey, action.searchText);
  }

  @Action(ClearFilterSearchResults)
  clearFilterSearchResults(ctx: StateContext<SearchStateModel>, action: ClearFilterSearchResults) {
    return this.handleClearFilterSearchResults(ctx, action.filterKey);
  }

  @Action(LoadFilterOptionsAndSetValues)
  loadFilterOptionsAndSetValues(ctx: StateContext<SearchStateModel>, action: LoadFilterOptionsAndSetValues) {
    return this.handleLoadFilterOptionsAndSetValues(ctx, action.filterValues);
  }

  @Action(UpdateFilterValue)
  updateFilterValue(ctx: StateContext<SearchStateModel>, action: UpdateFilterValue) {
    this.handleUpdateFilterValue(ctx, action.filterKey, action.value);
  }

  @Action(SetSortBy)
  setSortBy(ctx: StateContext<SearchStateModel>, action: SetSortBy) {
    ctx.patchState({ sortBy: action.sortBy });
  }

  @Action(SetResourceType)
  setResourceTab(ctx: StateContext<SearchStateModel>, action: SetResourceType) {
    ctx.patchState({ resourceType: action.resourceTab });
  }

  private buildFiltersParams(state: SearchStateModel): Record<string, string> {
    const filtersParams: Record<string, string> = {};

    Object.entries(state.filterValues).forEach(([key, value]) => {
      if (value) {
        const filterDefinition = state.filters.find((f) => f.key === key);
        const operator = filterDefinition?.operator;

        if (operator === 'is-present') {
          filtersParams[`cardSearchFilter[${key}][is-present]`] = value;
        } else {
          filtersParams[`cardSearchFilter[${key}][]`] = value;
        }
      }
    });

    return filtersParams;
  }
}
