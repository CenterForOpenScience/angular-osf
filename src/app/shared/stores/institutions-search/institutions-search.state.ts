import { Action, NgxsOnInit, State, StateContext, Store } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { BehaviorSubject, catchError, EMPTY, forkJoin, of, switchMap, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ResourcesData } from '@osf/features/search/models';
import { GetResourcesRequestTypeEnum, ResourceTab } from '@shared/enums';
import { Institution } from '@shared/models';
import { InstitutionsService, SearchService } from '@shared/services';
import { FetchResources, FetchResourcesByLink, InstitutionsSearchSelectors, UpdateResourceType } from '@shared/stores';
import { getResourceTypes } from '@shared/utils';

import {
  FetchInstitutionById,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  SetFilterValues,
  UpdateFilterValue,
  UpdateSortBy,
} from './institutions-search.actions';
import { InstitutionsSearchModel } from './institutions-search.model';

@State<InstitutionsSearchModel>({
  name: 'institutionsSearch',
  defaults: {
    institution: { data: {} as Institution, isLoading: false, error: null },
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
export class InstitutionsSearchState implements NgxsOnInit {
  private readonly institutionsService = inject(InstitutionsService);
  private readonly searchService = inject(SearchService);
  private readonly store = inject(Store);

  private loadRequests = new BehaviorSubject<{ type: GetResourcesRequestTypeEnum; link?: string } | null>(null);
  private filterOptionsRequests = new BehaviorSubject<string | null>(null);

  ngxsOnInit(ctx: StateContext<InstitutionsSearchModel>): void {
    this.setupLoadRequests(ctx);
    this.setupFilterOptionsRequests(ctx);
  }

  private setupLoadRequests(ctx: StateContext<InstitutionsSearchModel>) {
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

  private loadResources(ctx: StateContext<InstitutionsSearchModel>) {
    const state = ctx.getState();
    ctx.patchState({ resources: { ...state.resources, isLoading: true } });
    const filtersParams: Record<string, string> = {};
    const searchText = this.store.selectSnapshot(InstitutionsSearchSelectors.getSearchText);
    const sortBy = this.store.selectSnapshot(InstitutionsSearchSelectors.getSortBy);
    const resourceTab = this.store.selectSnapshot(InstitutionsSearchSelectors.getResourceType);
    const resourceTypes = getResourceTypes(resourceTab);

    filtersParams['cardSearchFilter[affiliation][]'] = this.store.selectSnapshot(InstitutionsSearchSelectors.getIris);

    Object.entries(state.filterValues).forEach(([key, value]) => {
      if (value) filtersParams[`cardSearchFilter[${key}][]`] = value;
    });

    return this.searchService
      .getResources(filtersParams, searchText, sortBy, resourceTypes)
      .pipe(tap((response) => this.updateResourcesState(ctx, response)));
  }

  private loadResourcesByLink(ctx: StateContext<InstitutionsSearchModel>, link?: string) {
    if (!link) return EMPTY;
    return this.searchService
      .getResourcesByLink(link)
      .pipe(tap((response) => this.updateResourcesState(ctx, response)));
  }

  private updateResourcesState(ctx: StateContext<InstitutionsSearchModel>, response: ResourcesData) {
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

  private setupFilterOptionsRequests(ctx: StateContext<InstitutionsSearchModel>) {
    this.filterOptionsRequests
      .pipe(
        switchMap((filterKey) => {
          if (!filterKey) return EMPTY;
          return this.handleFilterOptionLoad(ctx, filterKey);
        })
      )
      .subscribe();
  }

  private handleFilterOptionLoad(ctx: StateContext<InstitutionsSearchModel>, filterKey: string) {
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
      tap((options) => {
        const updatedCache = { ...ctx.getState().filterOptionsCache, [filterKey]: options };
        const updatedFilters = ctx
          .getState()
          .filters.map((f) => (f.key === filterKey ? { ...f, options, isLoaded: true, isLoading: false } : f));
        ctx.patchState({ filters: updatedFilters, filterOptionsCache: updatedCache });
      })
    );
  }

  @Action(FetchResources)
  getResources() {
    if (!this.store.selectSnapshot(InstitutionsSearchSelectors.getIris)) return;
    this.loadRequests.next({ type: GetResourcesRequestTypeEnum.GetResources });
  }

  @Action(FetchResourcesByLink)
  getResourcesByLink(_: StateContext<InstitutionsSearchState>, action: FetchResourcesByLink) {
    this.loadRequests.next({ type: GetResourcesRequestTypeEnum.GetResourcesByLink, link: action.link });
  }

  @Action(LoadFilterOptions)
  loadFilterOptions(_: StateContext<InstitutionsSearchModel>, action: LoadFilterOptions) {
    this.filterOptionsRequests.next(action.filterKey);
  }

  @Action(FetchInstitutionById)
  fetchInstitutionById(ctx: StateContext<InstitutionsSearchModel>, action: FetchInstitutionById) {
    ctx.patchState({ institution: { data: {} as Institution, isLoading: true, error: null } });

    return this.institutionsService.getInstitutionById(action.institutionId).pipe(
      tap((response) => {
        ctx.setState(
          patch({
            institution: patch({ data: response, error: null, isLoading: false }),
            providerIri: response.iris.join(','),
          })
        );
        this.loadRequests.next({ type: GetResourcesRequestTypeEnum.GetResources });
      }),
      catchError((error) => {
        ctx.patchState({ institution: { ...ctx.getState().institution, isLoading: false, error } });
        return throwError(() => error);
      })
    );
  }

  @Action(LoadFilterOptionsAndSetValues)
  loadFilterOptionsAndSetValues(ctx: StateContext<InstitutionsSearchModel>, action: LoadFilterOptionsAndSetValues) {
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
        tap((options) => {
          const updatedCache = { ...ctx.getState().filterOptionsCache, [key]: options };
          const updatedFilters = ctx
            .getState()
            .filters.map((f) => (f.key === key ? { ...f, options, isLoaded: true, isLoading: false } : f));
          ctx.patchState({ filters: updatedFilters, filterOptionsCache: updatedCache });
        }),
        catchError(() => of({ filterKey: key, options: [] }))
      )
    );

    return forkJoin(observables).pipe(tap(() => ctx.patchState({ filterValues: action.filterValues })));
  }

  @Action(SetFilterValues)
  setFilterValues(ctx: StateContext<InstitutionsSearchModel>, action: SetFilterValues) {
    ctx.patchState({ filterValues: action.filterValues });
  }

  @Action(UpdateFilterValue)
  updateFilterValue(ctx: StateContext<InstitutionsSearchModel>, action: UpdateFilterValue) {
    if (action.filterKey === 'search') {
      ctx.patchState({ searchText: action.value || '' });
      this.loadRequests.next({ type: GetResourcesRequestTypeEnum.GetResources });
      return;
    }

    const updatedFilterValues = { ...ctx.getState().filterValues, [action.filterKey]: action.value };
    ctx.patchState({ filterValues: updatedFilterValues });
    this.loadRequests.next({ type: GetResourcesRequestTypeEnum.GetResources });
  }

  @Action(UpdateResourceType)
  updateResourceType(ctx: StateContext<InstitutionsSearchModel>, action: UpdateResourceType) {
    ctx.patchState({ resourceType: action.type });
  }

  @Action(UpdateSortBy)
  updateSortBy(ctx: StateContext<InstitutionsSearchModel>, action: UpdateSortBy) {
    ctx.patchState({ sortBy: action.sortBy });
  }
}
