import { Action, NgxsOnInit, State, StateContext, Store } from '@ngxs/store';

import { BehaviorSubject, EMPTY, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { PreprintsResourcesFiltersSelectors } from '@osf/features/preprints/store/preprints-resources-filters';
import {
  GetResources,
  GetResourcesByLink,
  PreprintsSearchSelectors,
  ResetState,
  SetSearchText,
  SetSortBy,
} from '@osf/features/preprints/store/preprints-search';
import { ResourceFiltersStateModel } from '@osf/features/search/components/resource-filters/store';
import { SearchService } from '@osf/shared/services';
import { addFiltersParams, getResourceTypes } from '@osf/shared/utils';
import { searchStateDefaults } from '@shared/constants';
import { GetResourcesRequestTypeEnum, ResourceTab } from '@shared/enums';

import { PreprintsSearchStateModel } from './preprints-search.model';

@Injectable()
@State<PreprintsSearchStateModel>({
  name: 'preprintsSearch',
  defaults: searchStateDefaults,
})
export class PreprintsSearchState implements NgxsOnInit {
  searchService = inject(SearchService);
  store = inject(Store);
  loadRequests = new BehaviorSubject<{ type: GetResourcesRequestTypeEnum; link?: string } | null>(null);

  ngxsOnInit(ctx: StateContext<PreprintsSearchStateModel>): void {
    this.loadRequests
      .pipe(
        switchMap((query) => {
          if (!query) return EMPTY;
          const state = ctx.getState();
          ctx.patchState({ resources: { ...state.resources, isLoading: true } });
          if (query.type === GetResourcesRequestTypeEnum.GetResources) {
            const filters = this.store.selectSnapshot(PreprintsResourcesFiltersSelectors.getAllFilters);
            const filtersParams = addFiltersParams(filters as ResourceFiltersStateModel);
            const searchText = this.store.selectSnapshot(PreprintsSearchSelectors.getSearchText);
            const sortBy = this.store.selectSnapshot(PreprintsSearchSelectors.getSortBy);
            const resourceTab = ResourceTab.Preprints;
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
                  ctx.patchState({
                    resources: {
                      data: response.resources,
                      isLoading: false,
                      error: null,
                    },
                  });
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
  getResourcesByLink(ctx: StateContext<PreprintsSearchStateModel>, action: GetResourcesByLink) {
    this.loadRequests.next({
      type: GetResourcesRequestTypeEnum.GetResourcesByLink,
      link: action.link,
    });
  }

  @Action(SetSearchText)
  setSearchText(ctx: StateContext<PreprintsSearchStateModel>, action: SetSearchText) {
    ctx.patchState({ searchText: action.searchText });
  }

  @Action(SetSortBy)
  setSortBy(ctx: StateContext<PreprintsSearchStateModel>, action: SetSortBy) {
    ctx.patchState({ sortBy: action.sortBy });
  }

  @Action(ResetState)
  resetState(ctx: StateContext<PreprintsSearchStateModel>) {
    ctx.patchState(searchStateDefaults);
  }
}
