import { Action, State, StateContext, Store } from '@ngxs/store';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { UserSelectors } from '@core/store/user/user.selectors';
import {
  GetResources,
  GetResourcesByLink,
  MyProfileSelectors,
  MyProfileStateModel,
  SetIsMyProfile,
  SetResourceTab,
  SetSearchText,
  SetSortBy,
} from '@osf/features/my-profile/store';
import { searchStateDefaults } from '@osf/features/search/utils/data';
import { SearchService } from '@osf/shared/services';
import { addFiltersParams, getResourceTypes } from '@osf/shared/utils';

import { MyProfileResourceFiltersSelectors } from '../components/my-profile-resource-filters/store';

@Injectable()
@State<MyProfileStateModel>({
  name: 'myProfile',
  defaults: searchStateDefaults,
})
export class MyProfileState {
  searchService = inject(SearchService);
  store = inject(Store);
  currentUser = this.store.selectSignal(UserSelectors.getCurrentUser);

  @Action(GetResources)
  getResources(ctx: StateContext<MyProfileStateModel>) {
    const filters = this.store.selectSnapshot(MyProfileResourceFiltersSelectors.getAllFilters);
    const filtersParams = addFiltersParams(filters);
    const searchText = this.store.selectSnapshot(MyProfileSelectors.getSearchText);
    const sortBy = this.store.selectSnapshot(MyProfileSelectors.getSortBy);
    const resourceTab = this.store.selectSnapshot(MyProfileSelectors.getResourceTab);
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
  getResourcesByLink(ctx: StateContext<MyProfileStateModel>, action: GetResourcesByLink) {
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
  setSearchText(ctx: StateContext<MyProfileStateModel>, action: SetSearchText) {
    ctx.patchState({ searchText: action.searchText });
  }

  @Action(SetSortBy)
  setSortBy(ctx: StateContext<MyProfileStateModel>, action: SetSortBy) {
    ctx.patchState({ sortBy: action.sortBy });
  }

  @Action(SetResourceTab)
  setResourceTab(ctx: StateContext<MyProfileStateModel>, action: SetResourceTab) {
    ctx.patchState({ resourceTab: action.resourceTab });
  }

  @Action(SetIsMyProfile)
  setIsMyProfile(ctx: StateContext<MyProfileStateModel>, action: SetIsMyProfile) {
    ctx.patchState({ isMyProfile: action.isMyProfile });
  }
}
