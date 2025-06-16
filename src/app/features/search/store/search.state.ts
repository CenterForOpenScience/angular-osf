import { Action, NgxsOnInit, State, StateContext, Store } from '@ngxs/store';

import { BehaviorSubject, EMPTY, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { SearchService } from '@osf/shared/services';
import { addFiltersParams, getResourceTypes } from '@osf/shared/utils';
import { searchStateDefaults } from '@shared/constants';
import { GetResourcesRequestTypeEnum } from '@shared/enums';

import { ResourceFiltersSelectors } from '../components/resource-filters/store';

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
export class SearchState implements NgxsOnInit {
  searchService = inject(SearchService);
  store = inject(Store);
  loadRequests = new BehaviorSubject<{ type: GetResourcesRequestTypeEnum; link?: string } | null>(null);

  ngxsOnInit(ctx: StateContext<SearchStateModel>): void {
    this.loadRequests
      .pipe(
        switchMap((query) => {
          if (!query) return EMPTY;
          const state = ctx.getState();
          ctx.patchState({ resources: { ...state.resources, isLoading: true } });
          if (query.type === GetResourcesRequestTypeEnum.GetResources) {
            const filters = this.store.selectSnapshot(ResourceFiltersSelectors.getAllFilters);
            const filtersParams = addFiltersParams(filters);
            const searchText = this.store.selectSnapshot(SearchSelectors.getSearchText);
            const sortBy = this.store.selectSnapshot(SearchSelectors.getSortBy);
            const resourceTab = this.store.selectSnapshot(SearchSelectors.getResourceTab);
            const resourceTypes = getResourceTypes(resourceTab);

            return this.searchService.getResources(filtersParams, searchText, sortBy, resourceTypes).pipe(
              tap((response) => {
                ctx.patchState({ resources: { data: response.resources, isLoading: false, error: null } });
                ctx.patchState({ resourcesCount: response.count });
                ctx.patchState({ first: response.first });
                ctx.patchState({ next: response.next });
                ctx.patchState({ previous: response.previous });
              })
            );
          } else if (query.type === GetResourcesRequestTypeEnum.GetResourcesByLink) {
            if (query.link) {
              return this.searchService.getResourcesByLink(query.link!).pipe(
                tap((response) => {
                  ctx.patchState({ resources: { data: response.resources, isLoading: false, error: null } });
                  ctx.patchState({ resourcesCount: response.count });
                  ctx.patchState({ first: response.first });
                  ctx.patchState({ next: response.next });
                  ctx.patchState({ previous: response.previous });
                })
              );
            }
            return EMPTY;
          }
          return EMPTY;
        })
      )
      .subscribe();
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
