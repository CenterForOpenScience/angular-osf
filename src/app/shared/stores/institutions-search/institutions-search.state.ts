import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, tap, throwError } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { getResourceTypes } from '@osf/shared/helpers';
import { Institution } from '@osf/shared/models';
import { InstitutionsService } from '@osf/shared/services';
import { searchStateDefaults } from '@shared/constants';
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
  UpdateFilterValue,
  UpdateResourceType,
  UpdateSortBy,
} from './institutions-search.actions';
import { InstitutionsSearchModel } from './institutions-search.model';

@State<InstitutionsSearchModel>({
  name: 'institutionsSearch',
  defaults: {
    institution: { data: {} as Institution, isLoading: false, error: null },
    providerIri: '',
    ...searchStateDefaults,
  },
})
@Injectable()
export class InstitutionsSearchState extends BaseSearchState<InstitutionsSearchModel> {
  private readonly institutionsService = inject(InstitutionsService);

  @Action(FetchResources)
  fetchResources(ctx: StateContext<InstitutionsSearchModel>) {
    const state = ctx.getState();
    if (!state.providerIri) return;

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

  @Action(FetchResourcesByLink)
  fetchResourcesByLink(ctx: StateContext<InstitutionsSearchModel>, action: FetchResourcesByLink) {
    return this.handleFetchResourcesByLink(ctx, action.link);
  }

  @Action(LoadFilterOptions)
  loadFilterOptions(ctx: StateContext<InstitutionsSearchModel>, action: LoadFilterOptions) {
    return this.handleLoadFilterOptions(ctx, action.filterKey);
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

  @Action(UpdateFilterValue)
  updateFilterValue(ctx: StateContext<InstitutionsSearchModel>, action: UpdateFilterValue) {
    this.handleUpdateFilterValue(ctx, action.filterKey, action.value);
  }

  @Action(UpdateSortBy)
  updateSortBy(ctx: StateContext<InstitutionsSearchModel>, action: UpdateSortBy) {
    ctx.patchState({ sortBy: action.sortBy });
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

  private buildFiltersParams(state: InstitutionsSearchModel): Record<string, string> {
    const filtersParams: Record<string, string> = {};

    filtersParams['cardSearchFilter[affiliation][]'] = state.providerIri;

    //TODO see search state
    Object.entries(state.filterValues).forEach(([key, value]) => {
      if (value) filtersParams[`cardSearchFilter[${key}][]`] = value;
    });

    return filtersParams;
  }
}
