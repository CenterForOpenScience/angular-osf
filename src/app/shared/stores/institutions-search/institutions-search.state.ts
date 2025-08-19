import { Action, NgxsOnInit, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, Observable, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ResourcesData } from '@osf/features/search/models';
import { ResourceTab } from '@osf/shared/enums';
import { getResourceTypes } from '@osf/shared/helpers';
import { Institution } from '@osf/shared/models';
import { InstitutionsService } from '@osf/shared/services';
import { BaseSearchState } from '@shared/stores/base-search';

import {
  ClearFilterSearchResults,
  FetchInstitutionById,
  FetchResources,
  FetchResourcesByLink,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  LoadFilterOptionsWithSearch,
  LoadMoreFilterOptions,
  SetFilterValues,
  UpdateFilterValue,
  UpdateResourceType,
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
    filterSearchCache: {},
    filterPaginationCache: {},
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
export class InstitutionsSearchState extends BaseSearchState<InstitutionsSearchModel> implements NgxsOnInit {
  private readonly institutionsService = inject(InstitutionsService);

  ngxsOnInit(ctx: StateContext<InstitutionsSearchModel>): void {
    this.setupBaseRequests(ctx);
  }

  protected loadResources(ctx: StateContext<InstitutionsSearchModel>): Observable<ResourcesData> {
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

  protected buildFiltersParams(state: InstitutionsSearchModel): Record<string, string> {
    const filtersParams: Record<string, string> = {};

    filtersParams['cardSearchFilter[affiliation][]'] = state.providerIri;

    Object.entries(state.filterValues).forEach(([key, value]) => {
      if (value) filtersParams[`cardSearchFilter[${key}][]`] = value;
    });

    return filtersParams;
  }

  @Action(FetchResources)
  getResources(ctx: StateContext<InstitutionsSearchModel>) {
    if (!ctx.getState().providerIri) return;
    this.handleFetchResources();
  }

  @Action(FetchResourcesByLink)
  getResourcesByLink(_: StateContext<InstitutionsSearchModel>, action: FetchResourcesByLink) {
    this.handleFetchResourcesByLink(action.link);
  }

  @Action(LoadFilterOptions)
  loadFilterOptions(ctx: StateContext<InstitutionsSearchModel>, action: LoadFilterOptions) {
    this.handleLoadFilterOptions(ctx, action.filterKey);
  }

  @Action(LoadFilterOptionsWithSearch)
  loadFilterOptionsWithSearch(ctx: StateContext<InstitutionsSearchModel>, action: LoadFilterOptionsWithSearch) {
    return this.handleLoadFilterOptionsWithSearch(ctx, action.filterKey, action.searchText);
  }

  @Action(ClearFilterSearchResults)
  clearFilterSearchResults(ctx: StateContext<InstitutionsSearchModel>, action: ClearFilterSearchResults) {
    this.handleClearFilterSearchResults(ctx, action.filterKey);
  }

  @Action(LoadMoreFilterOptions)
  loadMoreFilterOptions(ctx: StateContext<InstitutionsSearchModel>, action: LoadMoreFilterOptions) {
    return this.handleLoadMoreFilterOptions(ctx, action.filterKey);
  }

  @Action(LoadFilterOptionsAndSetValues)
  loadFilterOptionsAndSetValues(ctx: StateContext<InstitutionsSearchModel>, action: LoadFilterOptionsAndSetValues) {
    return this.handleLoadFilterOptionsAndSetValues(ctx, action.filterValues);
  }

  @Action(SetFilterValues)
  setFilterValues(ctx: StateContext<InstitutionsSearchModel>, action: SetFilterValues) {
    this.handleSetFilterValues(ctx, action.filterValues);
  }

  @Action(UpdateFilterValue)
  updateFilterValue(ctx: StateContext<InstitutionsSearchModel>, action: UpdateFilterValue) {
    this.handleUpdateFilterValue(ctx, action.filterKey, action.value);
  }

  @Action(UpdateSortBy)
  updateSortBy(ctx: StateContext<InstitutionsSearchModel>, action: UpdateSortBy) {
    this.handleUpdateSortBy(ctx, action.sortBy);
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
        this.handleFetchResources();
      }),
      catchError((error) => {
        ctx.patchState({ institution: { ...ctx.getState().institution, isLoading: false, error } });
        return throwError(() => error);
      })
    );
  }

  @Action(UpdateResourceType)
  updateResourceType(ctx: StateContext<InstitutionsSearchModel>, action: UpdateResourceType) {
    ctx.patchState({ resourceType: action.type });
  }
}
