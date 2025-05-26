import { Action, State, StateContext, Store } from '@ngxs/store';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { SearchService } from '@osf/shared/services';
import { addFiltersParams, getResourceTypes } from '@osf/shared/utils';

import { ResourceFiltersSelectors } from '../components/resource-filters/store';
import { searchStateDefaults } from '../utils/data';

import {
  GetResources,
  GetResourcesByLink,
  ResetSearchState,
  SetIsMyProfile,
  SetResourceTab,
  SetSearchText,
  SetSortBy,
} from './search.actions';
import { SearchStateModel } from './search.model';
import { SearchSelectors } from './search.selectors';

@Injectable()
@State<SearchStateModel>({
  name: 'search',
  defaults: searchStateDefaults,
})
export class SearchState {
  searchService = inject(SearchService);
  store = inject(Store);

  @Action(GetResources)
  getResources(ctx: StateContext<SearchStateModel>) {
    const filters = this.store.selectSnapshot(ResourceFiltersSelectors.getAllFilters);
    const filtersParams = addFiltersParams(filters);
    const searchText = this.store.selectSnapshot(SearchSelectors.getSearchText);
    const sortBy = this.store.selectSnapshot(SearchSelectors.getSortBy);
    const resourceTab = this.store.selectSnapshot(SearchSelectors.getResourceTab);
    const resourceTypes = getResourceTypes(resourceTab);

    return this.searchService.getResources(filtersParams, searchText, sortBy, resourceTypes).pipe(
      tap((response) => {
        ctx.patchState({ resources: response.resources });
        ctx.patchState({ resourcesCount: response.count });
        ctx.patchState({ first: response.first });
        ctx.patchState({ next: response.next });
        ctx.patchState({ previous: response.previous });
      })
    );
  }

  @Action(GetResourcesByLink)
  getResourcesByLink(ctx: StateContext<SearchStateModel>, action: GetResourcesByLink) {
    return this.searchService.getResourcesByLink(action.link).pipe(
      tap((response) => {
        ctx.patchState({ resources: response.resources });
        ctx.patchState({ resourcesCount: response.count });
        ctx.patchState({ first: response.first });
        ctx.patchState({ next: response.next });
        ctx.patchState({ previous: response.previous });
      })
    );
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
