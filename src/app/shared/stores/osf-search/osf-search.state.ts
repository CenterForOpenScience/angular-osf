import { Action, State, StateContext } from '@ngxs/store';

import { catchError, EMPTY, forkJoin, Observable, of, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ResourcesData } from '@osf/features/search/models';
import { searchStateDefaults } from '@shared/constants';
import { ResourceTab } from '@shared/enums';
import { getResourceTypes, StringOrNull } from '@shared/helpers';
import { AsyncStateModel, DiscoverableFilter, Resource, SelectOption } from '@shared/models';
import { SearchService } from '@shared/services';

import {
  ClearFilterSearchResults,
  FetchResources,
  FetchResourcesByLink,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  LoadFilterOptionsWithSearch,
  LoadMoreFilterOptions,
  ResetSearchState,
  SetDefaultFilterValue,
  SetResourceType,
  SetSortBy,
  UpdateFilterValue,
} from './osf-search.actions';

import { environment } from 'src/environments/environment';

export interface OsfSearchStateModel {
  resources: AsyncStateModel<Resource[]>;
  filters: DiscoverableFilter[];
  defaultFilterValues: Record<string, string>;
  filterValues: Record<string, StringOrNull>;
  filterOptionsCache: Record<string, SelectOption[]>;
  filterSearchCache: Record<string, SelectOption[]>;
  filterPaginationCache: Record<string, string>;
  resourcesCount: number;
  searchText: StringOrNull;
  sortBy: string;
  first: string;
  next: string;
  previous: string;
  resourceType: ResourceTab;
}

@State<OsfSearchStateModel>({
  name: 'osfSearch',
  defaults: {
    ...searchStateDefaults,
  },
})
@Injectable()
export class OsfSearchState {
  private searchService = inject(SearchService);

  @Action(FetchResources)
  fetchResources(ctx: StateContext<OsfSearchStateModel>): Observable<ResourcesData> {
    const state = ctx.getState();

    ctx.patchState({ resources: { ...state.resources, isLoading: true } });
    const searchText = state.searchText;

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

    filtersParams['cardSearchFilter[resourceType]'] = getResourceTypes(state.resourceType);
    filtersParams['cardSearchFilter[accessService]'] = `${environment.webUrl}/`;
    filtersParams['cardSearchText[*,creator.name,isContainedBy.creator.name]'] = searchText ?? '';
    filtersParams['page[size]'] = '10';
    filtersParams['sort'] = state.sortBy;

    Object.entries(state.defaultFilterValues).forEach(([key, value]) => {
      filtersParams[`cardSearchFilter[${key}][]`] = value;
    });
    return this.searchService
      .getResources(filtersParams)
      .pipe(tap((response) => this.updateResourcesState(ctx, response)));
  }

  @Action(FetchResourcesByLink)
  fetchResourcesByLink(ctx: StateContext<OsfSearchStateModel>, action: FetchResourcesByLink) {
    if (!action.link) return EMPTY;
    return this.searchService
      .getResourcesByLink(action.link)
      .pipe(tap((response) => this.updateResourcesState(ctx, response)));
  }

  @Action(LoadFilterOptions)
  loadFilterOptions(ctx: StateContext<OsfSearchStateModel>, action: LoadFilterOptions) {
    const state = ctx.getState();
    const filterKey = action.filterKey;
    const cachedOptions = state.filterOptionsCache[filterKey];
    if (cachedOptions?.length) {
      const updatedFilters = state.filters.map((f) =>
        f.key === filterKey ? { ...f, options: cachedOptions, isLoaded: true, isLoading: false } : f
      );
      ctx.patchState({ filters: updatedFilters });
      return EMPTY;
    }

    const loadingFilters = state.filters.map((f) => (f.key === filterKey ? { ...f, isLoading: true } : f));
    ctx.patchState({ filters: loadingFilters });
    const resourceType = getResourceTypes(state.resourceType);

    return this.searchService.getFilterOptions(filterKey, resourceType).pipe(
      tap((response) => {
        const options = response.options;
        const updatedCache = { ...ctx.getState().filterOptionsCache, [filterKey]: options };
        const updatedPaginationCache = { ...ctx.getState().filterPaginationCache };

        if (response.nextUrl) {
          updatedPaginationCache[filterKey] = response.nextUrl;
        } else {
          delete updatedPaginationCache[filterKey];
        }

        const updatedFilters = ctx
          .getState()
          .filters.map((f) => (f.key === filterKey ? { ...f, options, isLoaded: true, isLoading: false } : f));

        ctx.patchState({
          filters: updatedFilters,
          filterOptionsCache: updatedCache,
          filterPaginationCache: updatedPaginationCache,
        });
      }),
      catchError(() => of({ options: [], nextUrl: undefined }))
    );
  }

  @Action(LoadMoreFilterOptions)
  loadMoreFilterOptions(ctx: StateContext<OsfSearchStateModel>, action: LoadMoreFilterOptions) {
    const state = ctx.getState();
    const filterKey = action.filterKey;

    const nextUrl = state.filterPaginationCache[filterKey];

    if (!nextUrl) {
      return;
    }

    const loadingFilters = state.filters.map((f) => (f.key === filterKey ? { ...f, isPaginationLoading: true } : f));
    ctx.patchState({ filters: loadingFilters });

    return this.searchService.getFilterOptionsFromPaginationUrl(nextUrl).pipe(
      tap((response) => {
        const currentOptions = ctx.getState().filterSearchCache[filterKey] || [];
        const updatedSearchCache = {
          ...ctx.getState().filterSearchCache,
          [filterKey]: [...currentOptions, ...response.options],
        };
        const updatedPaginationCache = { ...ctx.getState().filterPaginationCache };

        if (response.nextUrl) {
          updatedPaginationCache[filterKey] = response.nextUrl;
        } else {
          delete updatedPaginationCache[filterKey];
        }

        const updatedFilters = ctx
          .getState()
          .filters.map((f) => (f.key === filterKey ? { ...f, isPaginationLoading: false } : f));

        ctx.patchState({
          filters: updatedFilters,
          filterSearchCache: updatedSearchCache,
          filterPaginationCache: updatedPaginationCache,
        });
      })
    );
  }

  @Action(LoadFilterOptionsWithSearch)
  loadFilterOptionsWithSearch(ctx: StateContext<OsfSearchStateModel>, action: LoadFilterOptionsWithSearch) {
    const state = ctx.getState();
    const loadingFilters = state.filters.map((f) => (f.key === filterKey ? { ...f, isSearchLoading: true } : f));
    ctx.patchState({ filters: loadingFilters });
    const filterKey = action.filterKey;
    return this.searchService.getFilterOptionsWithSearch(filterKey, action.searchText).pipe(
      tap((response) => {
        const updatedSearchCache = { ...ctx.getState().filterSearchCache, [filterKey]: response.options };
        const updatedPaginationCache = { ...ctx.getState().filterPaginationCache };

        if (response.nextUrl) {
          updatedPaginationCache[filterKey] = response.nextUrl;
        } else {
          delete updatedPaginationCache[filterKey];
        }

        const updatedFilters = ctx
          .getState()
          .filters.map((f) => (f.key === filterKey ? { ...f, isSearchLoading: false } : f));

        ctx.patchState({
          filters: updatedFilters,
          filterSearchCache: updatedSearchCache,
          filterPaginationCache: updatedPaginationCache,
        });
      })
    );
  }

  @Action(ClearFilterSearchResults)
  clearFilterSearchResults(ctx: StateContext<OsfSearchStateModel>, action: ClearFilterSearchResults) {
    const state = ctx.getState();
    const filterKey = action.filterKey;
    const updatedSearchCache = { ...state.filterSearchCache };
    delete updatedSearchCache[filterKey];

    const updatedFilters = state.filters.map((f) => (f.key === filterKey ? { ...f, isSearchLoading: false } : f));

    ctx.patchState({
      filterSearchCache: updatedSearchCache,
      filters: updatedFilters,
    });
  }

  @Action(LoadFilterOptionsAndSetValues)
  loadFilterOptionsAndSetValues(ctx: StateContext<OsfSearchStateModel>, action: LoadFilterOptionsAndSetValues) {
    const filterValues = action.filterValues;
    const filterKeys = Object.keys(filterValues).filter((key) => filterValues[key]);
    if (!filterKeys.length) return;

    const loadingFilters = ctx
      .getState()
      .filters.map((f) =>
        filterKeys.includes(f.key) && !ctx.getState().filterOptionsCache[f.key]?.length ? { ...f, isLoading: true } : f
      );
    ctx.patchState({ filters: loadingFilters });
    ctx.patchState({ filterValues });

    const resourceType = getResourceTypes(ctx.getState().resourceType);

    const observables = filterKeys.map((key) =>
      this.searchService.getFilterOptions(key, resourceType).pipe(
        tap((response) => {
          const options = response.options;
          const updatedCache = { ...ctx.getState().filterOptionsCache, [key]: options };
          const updatedPaginationCache = { ...ctx.getState().filterPaginationCache };

          if (response.nextUrl) {
            updatedPaginationCache[key] = response.nextUrl;
          } else {
            delete updatedPaginationCache[key];
          }

          const updatedFilters = ctx
            .getState()
            .filters.map((f) => (f.key === key ? { ...f, options, isLoaded: true, isLoading: false } : f));

          ctx.patchState({
            filters: updatedFilters,
            filterOptionsCache: updatedCache,
            filterPaginationCache: updatedPaginationCache,
          });
        }),
        catchError(() => of({ options: [], nextUrl: undefined }))
      )
    );

    return forkJoin(observables);
  }

  @Action(SetDefaultFilterValue)
  setDefaultFilterValue(ctx: StateContext<OsfSearchStateModel>, action: SetDefaultFilterValue) {
    const updatedFilterValues = { ...ctx.getState().defaultFilterValues, [action.filterKey]: action.value };
    ctx.patchState({ defaultFilterValues: updatedFilterValues });
  }

  @Action(UpdateFilterValue)
  updateFilterValue(ctx: StateContext<OsfSearchStateModel>, action: UpdateFilterValue) {
    const filterKey = action.filterKey;
    const value = action.value;

    if (filterKey === 'search') {
      ctx.patchState({ searchText: value });
      return;
    }

    const updatedFilterValues = { ...ctx.getState().filterValues, [filterKey]: value };
    ctx.patchState({ filterValues: updatedFilterValues });
  }

  @Action(SetSortBy)
  setSortBy(ctx: StateContext<OsfSearchStateModel>, action: SetSortBy) {
    ctx.patchState({ sortBy: action.sortBy });
  }

  @Action(SetResourceType)
  setResourceType(ctx: StateContext<OsfSearchStateModel>, action: SetResourceType) {
    ctx.patchState({ resourceType: action.type });
  }

  @Action(ResetSearchState)
  resetSearchState(ctx: StateContext<OsfSearchStateModel>) {
    ctx.setState({
      ...searchStateDefaults,
    });
  }

  private updateResourcesState(ctx: StateContext<OsfSearchStateModel>, response: ResourcesData) {
    const state = ctx.getState();
    const filtersWithCachedOptions = (response.filters || []).map((filter) => {
      const cachedOptions = state.filterOptionsCache[filter.key];
      return cachedOptions?.length ? { ...filter, options: cachedOptions, isLoaded: true } : filter;
    });

    ctx.patchState({
      resources: { data: response.resources, isLoading: false, error: null },
      filters: filtersWithCachedOptions,
      resourcesCount: response.count,
      first: response.first,
      next: response.next,
      previous: response.previous,
    });
  }
}
