import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';

import { BehaviorSubject, EMPTY, forkJoin, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ResourcesData } from '@osf/features/search/models';
import { GetResourcesRequestTypeEnum } from '@osf/shared/enums';
import { SearchService } from '@osf/shared/services';
import { getResourceTypes } from '@osf/shared/utils';
import { searchStateDefaults } from '@shared/constants';

import {
  ClearFilterSearchResults,
  GetResources,
  GetResourcesByLink,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  LoadFilterOptionsWithSearch,
  LoadMoreFilterOptions,
  ResetSearchState,
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
export class SearchState implements NgxsOnInit {
  private readonly searchService = inject(SearchService);

  private loadRequests = new BehaviorSubject<{ type: GetResourcesRequestTypeEnum; link?: string } | null>(null);
  private filterOptionsRequests = new BehaviorSubject<string | null>(null);

  ngxsOnInit(ctx: StateContext<SearchStateModel>): void {
    this.setupLoadRequests(ctx);
    this.setupFilterOptionsRequests(ctx);
  }

  private setupLoadRequests(ctx: StateContext<SearchStateModel>) {
    this.loadRequests
      .pipe(
        switchMap((query) => {
          if (!query) return EMPTY;
          return query.type === GetResourcesRequestTypeEnum.GetResources
            ? this.loadResources(ctx)
            : this.loadResourcesByLink(ctx, query.link);
        })
      )
      .subscribe();
  }

  private loadResources(ctx: StateContext<SearchStateModel>) {
    const state = ctx.getState();
    ctx.patchState({ resources: { ...state.resources, isLoading: true } });
    const filtersParams: Record<string, string> = {};
    const searchText = state.searchText;
    const sortBy = state.sortBy;
    const resourceTab = state.resourceTab;
    const resourceTypes = getResourceTypes(resourceTab);

    Object.entries(state.filterValues).forEach(([key, value]) => {
      if (value) filtersParams[`cardSearchFilter[${key}][]`] = value;
    });

    return this.searchService
      .getResources(filtersParams, searchText, sortBy, resourceTypes)
      .pipe(tap((response) => this.updateResourcesState(ctx, response)));
  }

  private loadResourcesByLink(ctx: StateContext<SearchStateModel>, link?: string) {
    if (!link) return EMPTY;
    return this.searchService
      .getResourcesByLink(link)
      .pipe(tap((response) => this.updateResourcesState(ctx, response)));
  }

  private updateResourcesState(ctx: StateContext<SearchStateModel>, response: ResourcesData) {
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

  private setupFilterOptionsRequests(ctx: StateContext<SearchStateModel>) {
    this.filterOptionsRequests
      .pipe(
        switchMap((filterKey) => {
          if (!filterKey) return EMPTY;
          return this.handleFilterOptionLoad(ctx, filterKey);
        })
      )
      .subscribe();
  }

  private handleFilterOptionLoad(ctx: StateContext<SearchStateModel>, filterKey: string) {
    const state = ctx.getState();
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

    return this.searchService.getFilterOptions(filterKey).pipe(
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
      })
    );
  }

  @Action(GetResources)
  getResources() {
    this.loadRequests.next({
      type: GetResourcesRequestTypeEnum.GetResources,
    });
  }

  @Action(GetResourcesByLink)
  getResourcesByLink(ctx: StateContext<SearchStateModel>, action: GetResourcesByLink) {
    this.loadRequests.next({
      type: GetResourcesRequestTypeEnum.GetResourcesByLink,
      link: action.link,
    });
  }

  @Action(LoadFilterOptions)
  loadFilterOptions(_: StateContext<SearchStateModel>, action: LoadFilterOptions) {
    this.filterOptionsRequests.next(action.filterKey);
  }

  @Action(LoadFilterOptionsWithSearch)
  loadFilterOptionsWithSearch(ctx: StateContext<SearchStateModel>, action: LoadFilterOptionsWithSearch) {
    const state = ctx.getState();
    const loadingFilters = state.filters.map((f) => (f.key === action.filterKey ? { ...f, isSearchLoading: true } : f));
    ctx.patchState({ filters: loadingFilters });

    return this.searchService.getFilterOptionsWithSearch(action.filterKey, action.searchText).pipe(
      tap((response) => {
        const updatedSearchCache = { ...ctx.getState().filterSearchCache, [action.filterKey]: response.options };
        const updatedPaginationCache = { ...ctx.getState().filterPaginationCache };

        if (response.nextUrl) {
          updatedPaginationCache[action.filterKey] = response.nextUrl;
        } else {
          delete updatedPaginationCache[action.filterKey];
        }

        const updatedFilters = ctx
          .getState()
          .filters.map((f) => (f.key === action.filterKey ? { ...f, isSearchLoading: false } : f));

        ctx.patchState({
          filters: updatedFilters,
          filterSearchCache: updatedSearchCache,
          filterPaginationCache: updatedPaginationCache,
        });
      })
    );
  }

  @Action(ClearFilterSearchResults)
  clearFilterSearchResults(ctx: StateContext<SearchStateModel>, action: ClearFilterSearchResults) {
    const state = ctx.getState();
    const updatedSearchCache = { ...state.filterSearchCache };
    delete updatedSearchCache[action.filterKey];

    const updatedFilters = state.filters.map((f) =>
      f.key === action.filterKey ? { ...f, isSearchLoading: false } : f
    );

    ctx.patchState({
      filterSearchCache: updatedSearchCache,
      filters: updatedFilters,
    });
  }

  @Action(LoadMoreFilterOptions)
  loadMoreFilterOptions(ctx: StateContext<SearchStateModel>, action: LoadMoreFilterOptions) {
    const state = ctx.getState();
    const nextUrl = state.filterPaginationCache[action.filterKey];

    if (!nextUrl) {
      return;
    }

    const loadingFilters = state.filters.map((f) =>
      f.key === action.filterKey ? { ...f, isPaginationLoading: true } : f
    );
    ctx.patchState({ filters: loadingFilters });

    return this.searchService.getFilterOptionsFromPaginationUrl(nextUrl).pipe(
      tap((response) => {
        const currentOptions = ctx.getState().filterSearchCache[action.filterKey] || [];
        const updatedSearchCache = {
          ...ctx.getState().filterSearchCache,
          [action.filterKey]: [...currentOptions, ...response.options],
        };
        const updatedPaginationCache = { ...ctx.getState().filterPaginationCache };

        if (response.nextUrl) {
          updatedPaginationCache[action.filterKey] = response.nextUrl;
        } else {
          delete updatedPaginationCache[action.filterKey];
        }

        const updatedFilters = ctx
          .getState()
          .filters.map((f) => (f.key === action.filterKey ? { ...f, isPaginationLoading: false } : f));

        ctx.patchState({
          filters: updatedFilters,
          filterSearchCache: updatedSearchCache,
          filterPaginationCache: updatedPaginationCache,
        });
      })
    );
  }

  @Action(LoadFilterOptionsAndSetValues)
  loadFilterOptionsAndSetValues(ctx: StateContext<SearchStateModel>, action: LoadFilterOptionsAndSetValues) {
    const filterKeys = Object.keys(action.filterValues).filter((key) => action.filterValues[key]);
    if (!filterKeys.length) return;

    const loadingFilters = ctx
      .getState()
      .filters.map((f) =>
        filterKeys.includes(f.key) && !ctx.getState().filterOptionsCache[f.key]?.length ? { ...f, isLoading: true } : f
      );
    ctx.patchState({ filters: loadingFilters });

    const observables = filterKeys.map((key) =>
      this.searchService.getFilterOptions(key).pipe(
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
        })
      )
    );

    return forkJoin(observables).pipe(tap(() => ctx.patchState({ filterValues: action.filterValues })));
  }

  @Action(SetFilterValues)
  setFilterValues(ctx: StateContext<SearchStateModel>, action: SetFilterValues) {
    ctx.patchState({ filterValues: action.filterValues });
  }

  @Action(UpdateFilterValue)
  updateFilterValue(ctx: StateContext<SearchStateModel>, action: UpdateFilterValue) {
    if (action.filterKey === 'search') {
      ctx.patchState({ searchText: action.value || '' });
      this.loadRequests.next({ type: GetResourcesRequestTypeEnum.GetResources });
      return;
    }

    const updatedFilterValues = { ...ctx.getState().filterValues, [action.filterKey]: action.value };
    ctx.patchState({ filterValues: updatedFilterValues });
    this.loadRequests.next({ type: GetResourcesRequestTypeEnum.GetResources });
  }

  @Action(SetSearchText)
  setSearchText(ctx: StateContext<SearchStateModel>, action: SetSearchText) {
    ctx.patchState({ searchText: action.searchText });
  }

  @Action(SetSortBy)
  setSortBy(ctx: StateContext<SearchStateModel>, action: SetSortBy) {
    ctx.patchState({ sortBy: action.sortBy });
  }

  @Action(SetResourceTab)
  setResourceTab(ctx: StateContext<SearchStateModel>, action: SetResourceTab) {
    ctx.patchState({ resourceTab: action.resourceTab });
  }

  @Action(SetIsMyProfile)
  setIsMyProfile(ctx: StateContext<SearchStateModel>, action: SetIsMyProfile) {
    ctx.patchState({ isMyProfile: action.isMyProfile });
  }

  @Action(ResetSearchState)
  resetState(ctx: StateContext<SearchStateModel>) {
    ctx.patchState(searchStateDefaults);
  }
}
