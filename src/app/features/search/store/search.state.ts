import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';

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
  ResetSearchState,
  SetFilterOptionsFromUrl,
  SetFilterValues,
  SetIsMyProfile,
  SetResourceTab,
  SetSearchText,
  SetSortBy,
  UpdateFilterValue,
} from './search.actions';
import { SearchStateModel } from './search.model';

@Injectable()
@State<SearchStateModel>({
  name: 'search',
  defaults: searchStateDefaults,
})
export class SearchState extends BaseSearchState<SearchStateModel> implements NgxsOnInit {
  ngxsOnInit(ctx: StateContext<SearchStateModel>): void {
    this.setupBaseRequests(ctx);
  }

  protected loadResources(ctx: StateContext<SearchStateModel>): Observable<ResourcesData> {
    const state = ctx.getState();
    ctx.patchState({ resources: { ...state.resources, isLoading: true } });
    const filtersParams = this.buildFiltersParams(state);
    const searchText = state.searchText;
    const sortBy = state.sortBy;
    const resourceTab = state.resourceTab;
    const resourceTypes = getResourceTypes(resourceTab);

    return this.searchService
      .getResources(filtersParams, searchText, sortBy, resourceTypes)
      .pipe(tap((response) => this.updateResourcesState(ctx, response)));
  }

  protected buildFiltersParams(state: SearchStateModel): Record<string, string> {
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

    if (state.isMyProfile) {
      filtersParams['cardSearchFilter[creator][]'] = 'me';
    }

    return filtersParams;
  }

  @Action(GetResources)
  getResources() {
    this.handleFetchResources();
  }

  @Action(GetResourcesByLink)
  getResourcesByLink(_ctx: StateContext<SearchStateModel>, action: GetResourcesByLink) {
    this.handleFetchResourcesByLink(action.link);
  }

  @Action(LoadFilterOptions)
  loadFilterOptions(ctx: StateContext<SearchStateModel>, action: LoadFilterOptions) {
    this.handleLoadFilterOptions(ctx, action.filterKey);
  }

  @Action(LoadFilterOptionsWithSearch)
  loadFilterOptionsWithSearch(ctx: StateContext<SearchStateModel>, action: LoadFilterOptionsWithSearch) {
    return this.handleLoadFilterOptionsWithSearch(ctx, action.filterKey, action.searchText);
  }

  @Action(ClearFilterSearchResults)
  clearFilterSearchResults(ctx: StateContext<SearchStateModel>, action: ClearFilterSearchResults) {
    this.handleClearFilterSearchResults(ctx, action.filterKey);
  }

  @Action(LoadMoreFilterOptions)
  loadMoreFilterOptions(ctx: StateContext<SearchStateModel>, action: LoadMoreFilterOptions) {
    return this.handleLoadMoreFilterOptions(ctx, action.filterKey);
  }

  @Action(LoadFilterOptionsAndSetValues)
  loadFilterOptionsAndSetValues(ctx: StateContext<SearchStateModel>, action: LoadFilterOptionsAndSetValues) {
    return this.handleLoadFilterOptionsAndSetValues(ctx, action.filterValues);
  }

  @Action(SetFilterValues)
  setFilterValues(ctx: StateContext<SearchStateModel>, action: SetFilterValues) {
    this.handleSetFilterValues(ctx, action.filterValues);
  }

  @Action(UpdateFilterValue)
  updateFilterValue(ctx: StateContext<SearchStateModel>, action: UpdateFilterValue) {
    this.handleUpdateFilterValue(ctx, action.filterKey, action.value);
  }

  @Action(SetSortBy)
  setSortBy(ctx: StateContext<SearchStateModel>, action: SetSortBy) {
    this.handleUpdateSortBy(ctx, action.sortBy);
  }

  @Action(SetResourceTab)
  setResourceTab(ctx: StateContext<SearchStateModel>, action: SetResourceTab) {
    ctx.patchState({ resourceTab: action.resourceTab });
  }

  @Action(SetIsMyProfile)
  setIsMyProfile(ctx: StateContext<SearchStateModel>, action: SetIsMyProfile) {
    ctx.patchState({ isMyProfile: action.isMyProfile });
  }

  @Action(SetSearchText)
  setSearchText(ctx: StateContext<SearchStateModel>, action: SetSearchText) {
    ctx.patchState({ searchText: action.searchText });
  }

  @Action(SetFilterOptionsFromUrl)
  setFilterOptionsFromUrl(ctx: StateContext<SearchStateModel>, action: SetFilterOptionsFromUrl) {
    const currentState = ctx.getState();
    const updatedCache = { ...currentState.filterOptionsCache };

    Object.entries(action.filterOptions).forEach(([filterKey, options]) => {
      const existingOptions = updatedCache[filterKey] || [];
      const newOptions = options.map((opt) => ({ label: opt.label, value: opt.value }));

      const existingValues = new Set(existingOptions.map((opt) => opt.value));
      const uniqueNewOptions = newOptions.filter((opt) => !existingValues.has(opt.value));

      updatedCache[filterKey] = [...uniqueNewOptions, ...existingOptions];
    });

    const updatedFilters = currentState.filters.map((filter) => {
      const cachedOptions = updatedCache[filter.key];
      if (cachedOptions?.length) {
        return { ...filter, options: cachedOptions, isLoaded: true };
      }
      return filter;
    });

    ctx.patchState({
      filterOptionsCache: updatedCache,
      filters: updatedFilters,
    });
  }

  @Action(ResetSearchState)
  resetSearchState(ctx: StateContext<SearchStateModel>) {
    ctx.setState(searchStateDefaults);
  }
}
