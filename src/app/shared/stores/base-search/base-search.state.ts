import { StateContext } from '@ngxs/store';

import { BehaviorSubject, catchError, EMPTY, forkJoin, Observable, of, switchMap, tap } from 'rxjs';

import { inject } from '@angular/core';

import { ResourcesData } from '@osf/features/search/models';
import { GetResourcesRequestTypeEnum } from '@osf/shared/enums';
import { AsyncStateModel, DiscoverableFilter, SelectOption } from '@osf/shared/models';
import { SearchService } from '@osf/shared/services';

export interface BaseSearchStateModel {
  resources: AsyncStateModel<unknown[]>;
  filters: DiscoverableFilter[];
  filterValues: Record<string, string | null>;
  filterOptionsCache: Record<string, SelectOption[]>;
  filterSearchCache: Record<string, SelectOption[]>;
  filterPaginationCache: Record<string, string>;
  resourcesCount: number;
  searchText: string;
  sortBy: string;
  first: string;
  next: string;
  previous: string;
}

export abstract class BaseSearchState<T extends BaseSearchStateModel> {
  protected readonly searchService = inject(SearchService);

  protected loadRequests = new BehaviorSubject<{ type: GetResourcesRequestTypeEnum; link?: string } | null>(null);
  protected filterOptionsRequests = new BehaviorSubject<string | null>(null);

  protected setupBaseRequests(ctx: StateContext<T>): void {
    this.setupLoadRequests(ctx);
    this.setupFilterOptionsRequests(ctx);
  }

  protected setupLoadRequests(ctx: StateContext<T>) {
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

  protected setupFilterOptionsRequests(ctx: StateContext<T>) {
    this.filterOptionsRequests
      .pipe(
        switchMap((filterKey) => {
          if (!filterKey) return EMPTY;
          return this.handleFilterOptionLoad(ctx, filterKey);
        })
      )
      .subscribe();
  }

  protected abstract loadResources(ctx: StateContext<T>): Observable<ResourcesData>;
  protected abstract buildFiltersParams(state: T): Record<string, string>;

  protected loadResourcesByLink(ctx: StateContext<T>, link?: string) {
    if (!link) return EMPTY;
    return this.searchService
      .getResourcesByLink(link)
      .pipe(tap((response) => this.updateResourcesState(ctx, response)));
  }

  protected updateResourcesState(ctx: StateContext<T>, response: ResourcesData) {
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
    } as Partial<T>);
  }

  protected handleFilterOptionLoad(ctx: StateContext<T>, filterKey: string) {
    const state = ctx.getState();
    const cachedOptions = state.filterOptionsCache[filterKey];
    if (cachedOptions?.length) {
      const updatedFilters = state.filters.map((f) =>
        f.key === filterKey ? { ...f, options: cachedOptions, isLoaded: true, isLoading: false } : f
      );
      ctx.patchState({ filters: updatedFilters } as Partial<T>);
      return EMPTY;
    }

    const loadingFilters = state.filters.map((f) => (f.key === filterKey ? { ...f, isLoading: true } : f));
    ctx.patchState({ filters: loadingFilters } as Partial<T>);

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
        } as Partial<T>);
      }),
      catchError(() => of({ options: [], nextUrl: undefined }))
    );
  }

  protected handleLoadFilterOptions(_: StateContext<T>, filterKey: string) {
    this.filterOptionsRequests.next(filterKey);
  }

  protected handleLoadFilterOptionsWithSearch(ctx: StateContext<T>, filterKey: string, searchText: string) {
    const state = ctx.getState();
    const loadingFilters = state.filters.map((f) => (f.key === filterKey ? { ...f, isSearchLoading: true } : f));
    ctx.patchState({ filters: loadingFilters } as Partial<T>);

    return this.searchService.getFilterOptionsWithSearch(filterKey, searchText).pipe(
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
        } as Partial<T>);
      })
    );
  }

  protected handleClearFilterSearchResults(ctx: StateContext<T>, filterKey: string) {
    const state = ctx.getState();
    const updatedSearchCache = { ...state.filterSearchCache };
    delete updatedSearchCache[filterKey];

    const updatedFilters = state.filters.map((f) => (f.key === filterKey ? { ...f, isSearchLoading: false } : f));

    ctx.patchState({
      filterSearchCache: updatedSearchCache,
      filters: updatedFilters,
    } as Partial<T>);
  }

  protected handleLoadMoreFilterOptions(ctx: StateContext<T>, filterKey: string) {
    const state = ctx.getState();
    const nextUrl = state.filterPaginationCache[filterKey];

    if (!nextUrl) {
      return;
    }

    const loadingFilters = state.filters.map((f) => (f.key === filterKey ? { ...f, isPaginationLoading: true } : f));
    ctx.patchState({ filters: loadingFilters } as Partial<T>);

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
        } as Partial<T>);
      })
    );
  }

  protected handleLoadFilterOptionsAndSetValues(ctx: StateContext<T>, filterValues: Record<string, string | null>) {
    const filterKeys = Object.keys(filterValues).filter((key) => filterValues[key]);
    if (!filterKeys.length) return;

    const loadingFilters = ctx
      .getState()
      .filters.map((f) =>
        filterKeys.includes(f.key) && !ctx.getState().filterOptionsCache[f.key]?.length ? { ...f, isLoading: true } : f
      );
    ctx.patchState({ filters: loadingFilters } as Partial<T>);

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
          } as Partial<T>);
        }),
        catchError(() => of({ options: [], nextUrl: undefined }))
      )
    );

    return forkJoin(observables).pipe(tap(() => ctx.patchState({ filterValues } as Partial<T>)));
  }

  protected handleSetFilterValues(ctx: StateContext<T>, filterValues: Record<string, string | null>) {
    ctx.patchState({ filterValues } as Partial<T>);
  }

  protected handleUpdateFilterValue(ctx: StateContext<T>, filterKey: string, value: string | null) {
    if (filterKey === 'search') {
      ctx.patchState({ searchText: value || '' } as Partial<T>);
      this.loadRequests.next({ type: GetResourcesRequestTypeEnum.GetResources });
      return;
    }

    const updatedFilterValues = { ...ctx.getState().filterValues, [filterKey]: value };
    ctx.patchState({ filterValues: updatedFilterValues } as Partial<T>);
    this.loadRequests.next({ type: GetResourcesRequestTypeEnum.GetResources });
  }

  protected handleUpdateSortBy(ctx: StateContext<T>, sortBy: string) {
    ctx.patchState({ sortBy } as Partial<T>);
  }

  protected handleFetchResources() {
    this.loadRequests.next({ type: GetResourcesRequestTypeEnum.GetResources });
  }

  protected handleFetchResourcesByLink(link: string) {
    this.loadRequests.next({ type: GetResourcesRequestTypeEnum.GetResourcesByLink, link });
  }
}
