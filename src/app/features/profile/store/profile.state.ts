import { Action, State, StateContext, Store } from '@ngxs/store';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { UserSelectors } from '@osf/core/store/user';
import {
  GetResources,
  GetResourcesByLink,
  ProfileSelectors,
  ProfileStateModel,
  SetIsMyProfile,
  SetResourceTab,
  SetSearchText,
  SetSortBy,
} from '@osf/features/profile/store';
import { addFiltersParams, getResourceTypes } from '@osf/shared/helpers';
import { SearchService } from '@osf/shared/services';
import { searchStateDefaults } from '@shared/constants';

import { ProfileResourceFiltersSelectors } from '../components/profile-resource-filters/store';

@Injectable()
@State<ProfileStateModel>({
  name: 'profile',
  defaults: searchStateDefaults,
})
export class ProfileState {
  searchService = inject(SearchService);
  store = inject(Store);
  currentUser = this.store.selectSignal(UserSelectors.getCurrentUser);

  @Action(GetResources)
  getResources(ctx: StateContext<ProfileStateModel>) {
    const filters = this.store.selectSnapshot(ProfileResourceFiltersSelectors.getAllFilters);
    const filtersParams = addFiltersParams(filters);
    const searchText = this.store.selectSnapshot(ProfileSelectors.getSearchText);
    const sortBy = this.store.selectSnapshot(ProfileSelectors.getSortBy);
    const resourceTab = this.store.selectSnapshot(ProfileSelectors.getResourceTab);
    const resourceTypes = getResourceTypes(resourceTab);
    const iri = this.currentUser()?.iri;
    if (iri) {
      filtersParams['cardSearchFilter[creator][]'] = iri;
    }

    return this.searchService.getResources(filtersParams, searchText, sortBy, resourceTypes).pipe(
      tap((response) => {
        ctx.patchState({ resources: { data: response.resources, isLoading: false, error: null } });
        ctx.patchState({ resourcesCount: response.count });
        ctx.patchState({ first: response.first });
        ctx.patchState({ next: response.next });
        ctx.patchState({ previous: response.previous });
      })
    );
  }

  @Action(GetResourcesByLink)
  getResourcesByLink(ctx: StateContext<ProfileStateModel>, action: GetResourcesByLink) {
    return this.searchService.getResourcesByLink(action.link).pipe(
      tap((response) => {
        ctx.patchState({ resources: { data: response.resources, isLoading: false, error: null } });
        ctx.patchState({ resourcesCount: response.count });
        ctx.patchState({ first: response.first });
        ctx.patchState({ next: response.next });
        ctx.patchState({ previous: response.previous });
      })
    );
  }

  @Action(SetSearchText)
  setSearchText(ctx: StateContext<ProfileStateModel>, action: SetSearchText) {
    ctx.patchState({ searchText: action.searchText });
  }

  @Action(SetSortBy)
  setSortBy(ctx: StateContext<ProfileStateModel>, action: SetSortBy) {
    ctx.patchState({ sortBy: action.sortBy });
  }

  @Action(SetResourceTab)
  setResourceTab(ctx: StateContext<ProfileStateModel>, action: SetResourceTab) {
    ctx.patchState({ resourceTab: action.resourceTab });
  }

  @Action(SetIsMyProfile)
  setIsMyProfile(ctx: StateContext<ProfileStateModel>, action: SetIsMyProfile) {
    ctx.patchState({ isMyProfile: action.isMyProfile });
  }
}
