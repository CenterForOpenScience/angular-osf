import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@core/handlers';
import { CollectionsService } from '@shared/services';
import { CollectionsStateModel } from '@shared/stores';

import { GetCollectionSubmissions } from './collections-moderation.actions';
import { COLLECTIONS_MODERATION_STATE_DEFAULTS, CollectionsModerationStateModel } from './collections-moderation.model';

@State<CollectionsModerationStateModel>({
  name: 'collectionsModeration',
  defaults: COLLECTIONS_MODERATION_STATE_DEFAULTS,
})
@Injectable()
export class CollectionsModerationState {
  collectionsService = inject(CollectionsService);

  @Action(GetCollectionSubmissions)
  getCollectionSubmissions(ctx: StateContext<CollectionsStateModel>, action: GetCollectionSubmissions) {
    const state = ctx.getState();
    ctx.patchState({
      collectionSubmissions: {
        ...state.collectionSubmissions,
        isLoading: true,
      },
    });

    return this.collectionsService
      .fetchCollectionSubmissions(action.collectionId, action.status, action.page, action.sortBy)
      .pipe(
        tap((res) => {
          ctx.patchState({
            collectionSubmissions: {
              data: res,
              isLoading: false,
              error: null,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'collectionSubmissions', error))
      );
  }
}
