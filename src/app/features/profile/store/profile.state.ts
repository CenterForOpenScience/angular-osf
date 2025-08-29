import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { UserService } from '@core/services';
import { getResourceTypes, handleSectionError } from '@osf/shared/helpers';
import { BaseSearchState } from '@shared/stores';

import {
  ClearFilterSearchResults,
  FetchResources,
  FetchResourcesByLink,
  FetchUserProfile,
  LoadFilterOptions,
  LoadFilterOptionsAndSetValues,
  LoadFilterOptionsWithSearch,
  LoadMoreFilterOptions,
  SetResourceType,
  SetSortBy,
  SetUserProfile,
  UpdateFilterValue,
} from './profile.actions';
import { PROFILE_STATE_DEFAULTS, ProfileStateModel } from './profile.model';

@Injectable()
@State<ProfileStateModel>({
  name: 'profile',
  defaults: PROFILE_STATE_DEFAULTS,
})
export class ProfileState extends BaseSearchState<ProfileStateModel> {
  private userService = inject(UserService);

  @Action(FetchUserProfile)
  fetchUserProfile(ctx: StateContext<ProfileStateModel>, action: FetchUserProfile) {
    ctx.setState(patch({ userProfile: patch({ isLoading: true }) }));

    return this.userService.getUserById(action.userId).pipe(
      tap((user) => {
        ctx.setState(
          patch({
            userProfile: patch({
              data: user,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'userProfile', error))
    );
  }

  @Action(SetUserProfile)
  setUserProfile(ctx: StateContext<ProfileStateModel>, action: SetUserProfile) {
    ctx.setState(
      patch({
        userProfile: patch({
          data: action.userProfile,
          isLoading: false,
        }),
      })
    );
  }

  @Action(FetchResources)
  fetchResources(ctx: StateContext<ProfileStateModel>) {
    const state = ctx.getState();
    if (!state.userProfile) return;

    ctx.patchState({ resources: { ...state.resources, isLoading: true } });
    const filtersParams = this.buildFiltersParams(state);
    const sortBy = state.sortBy;
    const resourceTypes = getResourceTypes(state.resourceType);

    return this.searchService
      .getResources(filtersParams, null, sortBy, resourceTypes)
      .pipe(tap((response) => this.updateResourcesState(ctx, response)));
  }

  @Action(FetchResourcesByLink)
  fetchResourcesByLink(ctx: StateContext<ProfileStateModel>, action: FetchResourcesByLink) {
    return this.handleFetchResourcesByLink(ctx, action.link);
  }

  @Action(LoadFilterOptions)
  loadFilterOptions(ctx: StateContext<ProfileStateModel>, action: LoadFilterOptions) {
    return this.handleLoadFilterOptions(ctx, action.filterKey);
  }

  @Action(LoadFilterOptionsWithSearch)
  loadFilterOptionsWithSearch(ctx: StateContext<ProfileStateModel>, action: LoadFilterOptionsWithSearch) {
    return this.handleLoadFilterOptionsWithSearch(ctx, action.filterKey, action.searchText);
  }

  @Action(ClearFilterSearchResults)
  clearFilterSearchResults(ctx: StateContext<ProfileStateModel>, action: ClearFilterSearchResults) {
    this.handleClearFilterSearchResults(ctx, action.filterKey);
  }

  @Action(LoadMoreFilterOptions)
  loadMoreFilterOptions(ctx: StateContext<ProfileStateModel>, action: LoadMoreFilterOptions) {
    return this.handleLoadMoreFilterOptions(ctx, action.filterKey);
  }

  @Action(LoadFilterOptionsAndSetValues)
  loadFilterOptionsAndSetValues(ctx: StateContext<ProfileStateModel>, action: LoadFilterOptionsAndSetValues) {
    return this.handleLoadFilterOptionsAndSetValues(ctx, action.filterValues);
  }

  @Action(UpdateFilterValue)
  updateFilterValue(ctx: StateContext<ProfileStateModel>, action: UpdateFilterValue) {
    this.handleUpdateFilterValue(ctx, action.filterKey, action.value);
  }

  @Action(SetSortBy)
  updateSortBy(ctx: StateContext<ProfileStateModel>, action: SetSortBy) {
    ctx.patchState({ sortBy: action.sortBy });
  }

  @Action(SetResourceType)
  setResourceTab(ctx: StateContext<ProfileStateModel>, action: SetResourceType) {
    ctx.patchState({ resourceType: action.resourceType });
  }

  private buildFiltersParams(state: ProfileStateModel): Record<string, string> {
    const filtersParams: Record<string, string> = {};

    filtersParams['cardSearchFilter[creator][]'] = state.userProfile.data!.iri!;

    //TODO see search state
    Object.entries(state.filterValues).forEach(([key, value]) => {
      if (value) filtersParams[`cardSearchFilter[${key}][]`] = value;
    });

    return filtersParams;
  }
}
