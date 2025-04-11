import { inject, Injectable } from '@angular/core';
import { SearchService } from '@osf/features/search/search.service';
import { SearchStateModel } from '@osf/features/search/store/search.model';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { GetResources } from '@osf/features/search/store/search.actions';
import { tap } from 'rxjs';
import { ResourceFiltersSelectors } from '@shared/components/resources/resource-filters/store';

@Injectable()
@State<SearchStateModel>({
  name: 'search',
  defaults: {
    resources: [],
  },
})
export class SearchState {
  searchService = inject(SearchService);
  store = inject(Store);

  @Action(GetResources)
  getResources(ctx: StateContext<SearchStateModel>) {
    const creatorParams: Record<string, string> = {};

    const creatorFilters = this.store.selectSignal(
      ResourceFiltersSelectors.getCreator,
    );
    if (creatorFilters()) {
      creatorParams['cardSearchFilter[creator][]'] = creatorFilters();
    }

    return this.searchService.getResources(creatorParams).pipe(
      tap((resources) => {
        ctx.patchState({ resources: resources });
      }),
    );
  }
}
