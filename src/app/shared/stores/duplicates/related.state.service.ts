import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@shared/helpers';
import { RelatedService } from '@shared/services/related.service';

import { ClearDuplicates, GetAllDuplicates, GetAllLinkedProjects } from './related.actions';
import { DUPLICATES_DEFAULTS, DuplicatesStateModel } from './related.model';

@State<DuplicatesStateModel>({
  name: 'duplicates',
  defaults: DUPLICATES_DEFAULTS,
})
@Injectable()
export class RelatedState {
  relatedService = inject(RelatedService);

  @Action(GetAllDuplicates)
  getDuplicates(ctx: StateContext<DuplicatesStateModel>, action: GetAllDuplicates) {
    const state = ctx.getState();
    ctx.patchState({
      related: {
        ...state.related,
        isLoading: true,
      },
    });

    return this.relatedService
      .fetchAllDuplicates(action.resourceId, action.resourceType, action.page, action.pageSize)
      .pipe(
        tap((response) => {
          ctx.patchState({
            related: {
              data: response.data,
              isLoading: false,
              error: null,
              totalCount: response.totalCount,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'related', error))
      );
  }

  @Action(GetAllLinkedProjects)
  getLinkedProjects(ctx: StateContext<DuplicatesStateModel>, action: GetAllDuplicates) {
    const state = ctx.getState();
    ctx.patchState({
      related: {
        ...state.related,
        isLoading: true,
      },
    });

    return this.relatedService
      .fetchAllLinkedNodes(action.resourceId, action.resourceType, action.page, action.pageSize)
      .pipe(
        tap((response) => {
          ctx.patchState({
            related: {
              data: response.data,
              isLoading: false,
              error: null,
              totalCount: response.totalCount,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'related', error))
      );
  }

  @Action(ClearDuplicates)
  clearDuplicates(ctx: StateContext<DuplicatesStateModel>) {
    ctx.patchState(DUPLICATES_DEFAULTS);
  }
}
