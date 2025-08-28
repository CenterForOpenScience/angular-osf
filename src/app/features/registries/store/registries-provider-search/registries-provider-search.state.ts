import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, EMPTY, forkJoin, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ProvidersService } from '@osf/features/registries/services';
import {
  FetchResources,
  FetchResourcesByLink,
  GetRegistryProviderBrand,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  UpdateFilterValue,
  UpdateResourceType,
  UpdateSortBy,
} from '@osf/features/registries/store/registries-provider-search/registries-provider-search.actions';
import { RegistriesProviderSearchStateModel } from '@osf/features/registries/store/registries-provider-search/registries-provider-search.model';
import { ResourcesData } from '@osf/features/search/models';
import { getResourceTypes } from '@osf/shared/helpers';
import { ResourceTab } from '@shared/enums';
import { handleSectionError } from '@shared/helpers';
import { SearchService } from '@shared/services';

@State<RegistriesProviderSearchStateModel>({
  name: 'registryProviderSearch',
  defaults: {
    currentBrandedProvider: {
      data: null,
      isLoading: false,
      error: null,
    },
    resources: { data: [], isLoading: false, error: null },
    filters: [],
    filterValues: {},
    filterOptionsCache: {},
    providerIri: '',
    resourcesCount: 0,
    searchText: '',
    sortBy: '-relevance',
    first: '',
    next: '',
    previous: '',
    resourceType: ResourceTab.All,
  },
})
@Injectable()
export class RegistriesProviderSearchState {
  private readonly searchService = inject(SearchService);
  providersService = inject(ProvidersService);

  private updateResourcesState(ctx: StateContext<RegistriesProviderSearchStateModel>, response: ResourcesData) {
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

  @Action(FetchResources)
  getResources(ctx: StateContext<RegistriesProviderSearchStateModel>) {
    const state = ctx.getState();
    if (!state.providerIri) return;

    ctx.patchState({ resources: { ...state.resources, isLoading: true } });
    const filtersParams: Record<string, string> = {};
    const searchText = state.searchText;
    const sortBy = state.sortBy;
    const resourceTypes = getResourceTypes(ResourceTab.Registrations);

    filtersParams['cardSearchFilter[publisher][]'] = state.providerIri;

    Object.entries(state.filterValues).forEach(([key, value]) => {
      if (value) filtersParams[`cardSearchFilter[${key}][]`] = value;
    });

    return this.searchService
      .getResources(filtersParams, searchText, sortBy, resourceTypes)
      .pipe(tap((response) => this.updateResourcesState(ctx, response)));
  }

  @Action(FetchResourcesByLink)
  getResourcesByLink(ctx: StateContext<RegistriesProviderSearchStateModel>, action: FetchResourcesByLink) {
    if (!action.link) return EMPTY;
    return this.searchService
      .getResourcesByLink(action.link)
      .pipe(tap((response) => this.updateResourcesState(ctx, response)));
  }

  @Action(LoadFilterOptions)
  loadFilterOptions(ctx: StateContext<RegistriesProviderSearchStateModel>, action: LoadFilterOptions) {
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

    return this.searchService.getFilterOptions(filterKey).pipe(
      tap((response) => {
        const options = response.options;
        const updatedCache = { ...ctx.getState().filterOptionsCache, [filterKey]: options };
        const updatedFilters = ctx
          .getState()
          .filters.map((f) => (f.key === filterKey ? { ...f, options, isLoaded: true, isLoading: false } : f));
        ctx.patchState({ filters: updatedFilters, filterOptionsCache: updatedCache });
      })
    );
  }

  @Action(UpdateResourceType)
  updateResourceType(ctx: StateContext<RegistriesProviderSearchStateModel>, action: UpdateResourceType) {
    ctx.patchState({ resourceType: action.type });
  }

  @Action(LoadFilterOptionsAndSetValues)
  loadFilterOptionsAndSetValues(
    ctx: StateContext<RegistriesProviderSearchStateModel>,
    action: LoadFilterOptionsAndSetValues
  ) {
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
          const updatedFilters = ctx
            .getState()
            .filters.map((f) => (f.key === key ? { ...f, options, isLoaded: true, isLoading: false } : f));
          ctx.patchState({ filters: updatedFilters, filterOptionsCache: updatedCache });
        })
      )
    );

    return forkJoin(observables).pipe(tap(() => ctx.patchState({ filterValues: action.filterValues })));
  }

  @Action(UpdateFilterValue)
  updateFilterValue(ctx: StateContext<RegistriesProviderSearchStateModel>, action: UpdateFilterValue) {
    if (action.filterKey === 'search') {
      ctx.patchState({ searchText: action.value || '' });
      return;
    }

    const updatedFilterValues = { ...ctx.getState().filterValues, [action.filterKey]: action.value };
    ctx.patchState({ filterValues: updatedFilterValues });
  }

  @Action(GetRegistryProviderBrand)
  getProviderBrand(ctx: StateContext<RegistriesProviderSearchStateModel>, action: GetRegistryProviderBrand) {
    const state = ctx.getState();
    ctx.patchState({
      currentBrandedProvider: {
        ...state.currentBrandedProvider,
        isLoading: true,
      },
    });

    return this.providersService.getProviderBrand(action.providerName).pipe(
      tap((brand) => {
        ctx.setState(
          patch({
            currentBrandedProvider: patch({
              data: brand,
              isLoading: false,
              error: null,
            }),
            providerIri: brand.iri,
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'currentBrandedProvider', error))
    );
  }

  @Action(UpdateSortBy)
  updateSortBy(ctx: StateContext<RegistriesProviderSearchStateModel>, action: UpdateSortBy) {
    ctx.patchState({ sortBy: action.sortBy });
  }
}
