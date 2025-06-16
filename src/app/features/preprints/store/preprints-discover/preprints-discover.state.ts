import { Action, NgxsOnInit, State, StateContext, Store } from '@ngxs/store';

import { BehaviorSubject, EMPTY, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import {
  GetResources,
  GetResourcesByLink,
  ResetState,
  SetProviderIri,
  SetSearchText,
  SetSortBy,
} from '@osf/features/preprints/store/preprints-discover/preprints-discover.actions';
import { PreprintsDiscoverStateModel } from '@osf/features/preprints/store/preprints-discover/preprints-discover.model';
import { PreprintsDiscoverSelectors } from '@osf/features/preprints/store/preprints-discover/preprints-discover.selectors';
import { PreprintsResourcesFiltersSelectors } from '@osf/features/preprints/store/preprints-resources-filters';
import { ResourceFiltersStateModel } from '@osf/features/search/components/resource-filters/store';
import { GetResourcesRequestTypeEnum, ResourceTab } from '@shared/enums';
import { SearchService } from '@shared/services';
import { addFiltersParams, getResourceTypes } from '@shared/utils';

@State<PreprintsDiscoverStateModel>({
  name: 'preprintsDiscover',
  defaults: {
    resources: {
      data: [],
      isLoading: false,
      error: null,
    },
    providerIri: '',
    resourcesCount: 0,
    searchText: '',
    sortBy: '-relevance',
    first: '',
    next: '',
    previous: '',
  },
})
@Injectable()
export class PreprintsDiscoverState implements NgxsOnInit {
  searchService = inject(SearchService);
  store = inject(Store);
  loadRequests = new BehaviorSubject<{ type: GetResourcesRequestTypeEnum; link?: string } | null>(null);

  ngxsOnInit(ctx: StateContext<PreprintsDiscoverStateModel>): void {
    this.loadRequests
      .pipe(
        switchMap((query) => {
          if (!query) return EMPTY;
          const state = ctx.getState();
          ctx.patchState({ resources: { ...state.resources, isLoading: true } });
          if (query.type === GetResourcesRequestTypeEnum.GetResources) {
            const filters = this.store.selectSnapshot(PreprintsResourcesFiltersSelectors.getAllFilters);
            const filtersParams = addFiltersParams(filters as ResourceFiltersStateModel);
            const searchText = this.store.selectSnapshot(PreprintsDiscoverSelectors.getSearchText);
            const sortBy = this.store.selectSnapshot(PreprintsDiscoverSelectors.getSortBy);
            const resourceTab = ResourceTab.Preprints;
            const resourceTypes = getResourceTypes(resourceTab);
            filtersParams['cardSearchFilter[publisher][]'] = this.store.selectSnapshot(
              PreprintsDiscoverSelectors.getIri
            );

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
    if (!this.store.selectSnapshot(PreprintsDiscoverSelectors.getIri)) {
      return;
    }
    this.loadRequests.next({
      type: GetResourcesRequestTypeEnum.GetResources,
    });
  }

  @Action(GetResourcesByLink)
  getResourcesByLink(ctx: StateContext<PreprintsDiscoverStateModel>, action: GetResourcesByLink) {
    this.loadRequests.next({
      type: GetResourcesRequestTypeEnum.GetResourcesByLink,
      link: action.link,
    });
  }

  @Action(SetSearchText)
  setSearchText(ctx: StateContext<PreprintsDiscoverStateModel>, action: SetSearchText) {
    ctx.patchState({ searchText: action.searchText });
  }

  @Action(SetSortBy)
  setSortBy(ctx: StateContext<PreprintsDiscoverStateModel>, action: SetSortBy) {
    ctx.patchState({ sortBy: action.sortBy });
  }

  @Action(SetProviderIri)
  setProviderIri(ctx: StateContext<PreprintsDiscoverStateModel>, action: SetProviderIri) {
    ctx.patchState({ providerIri: action.providerIri });
  }

  @Action(ResetState)
  resetState(ctx: StateContext<PreprintsDiscoverStateModel>) {
    ctx.patchState({
      resources: {
        data: [],
        isLoading: false,
        error: null,
      },
      providerIri: '',
      resourcesCount: 0,
      searchText: '',
      sortBy: '-relevance',
      first: '',
      next: '',
      previous: '',
    });
  }
}
