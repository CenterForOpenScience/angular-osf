import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@core/handlers';
import { CollectionsService } from '@shared/services';

import {
  ClearCollectionModeration,
  CreateCollectionSubmissionAction,
  GetCollectionSubmissions,
  GetSubmissionsReviewActions,
} from './collections-moderation.actions';
import { COLLECTIONS_MODERATION_STATE_DEFAULTS, CollectionsModerationStateModel } from './collections-moderation.model';

@State<CollectionsModerationStateModel>({
  name: 'collectionsModeration',
  defaults: COLLECTIONS_MODERATION_STATE_DEFAULTS,
})
@Injectable()
export class CollectionsModerationState {
  collectionsService = inject(CollectionsService);

  @Action(GetCollectionSubmissions)
  getCollectionSubmissions(ctx: StateContext<CollectionsModerationStateModel>, action: GetCollectionSubmissions) {
    ctx.setState(patch({ collectionSubmissions: patch({ isLoading: true }) }));

    return this.collectionsService
      .fetchCollectionSubmissionsByStatus(action.collectionId, action.status, action.page, action.sortBy)
      .pipe(
        switchMap((res) => {
          if (!res.data.length) {
            return of({
              data: [],
              totalCount: res.totalCount,
            });
          }

          const actionRequests = res.data.map((submission) =>
            this.collectionsService.fetchCollectionSubmissionsActions(submission.nodeId, action.collectionId)
          );

          return forkJoin(actionRequests).pipe(
            map((actions) => ({
              data: res.data.map((submission, i) => ({ ...submission, actions: actions[i] })),
              totalCount: res.totalCount,
            }))
          );
        }),
        tap((res) => {
          ctx.patchState({
            collectionSubmissions: {
              data: res.data,
              isLoading: false,
              error: null,
              totalCount: res.totalCount,
            },
          });
        }),
        catchError((error) => handleSectionError(ctx, 'collectionSubmissions', error))
      );
  }

  @Action(GetSubmissionsReviewActions)
  getCurrentReviewAction(ctx: StateContext<CollectionsModerationStateModel>, action: GetSubmissionsReviewActions) {
    ctx.patchState({
      currentReviewAction: {
        ...ctx.getState().currentReviewAction,
        isLoading: true,
      },
    });

    return this.collectionsService.fetchCollectionSubmissionsActions(action.submissionId, action.collectionId).pipe(
      tap((res) => {
        ctx.patchState({
          currentReviewAction: {
            data: res[0] || null,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'currentReviewAction', error))
    );
  }

  @Action(CreateCollectionSubmissionAction)
  createCollectionSubmissionAction(
    ctx: StateContext<CollectionsModerationStateModel>,
    action: CreateCollectionSubmissionAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      collectionSubmissions: {
        ...state.collectionSubmissions,
        isSubmitting: true,
      },
    });

    return this.collectionsService.createCollectionSubmissionAction(action.payload).pipe(
      tap(() => {
        ctx.patchState({
          collectionSubmissions: {
            ...state.collectionSubmissions,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'collectionSubmissions', error))
    );
  }

  @Action(ClearCollectionModeration)
  clearCollectionModeration(ctx: StateContext<CollectionsModerationStateModel>) {
    ctx.setState(COLLECTIONS_MODERATION_STATE_DEFAULTS);
  }
}
