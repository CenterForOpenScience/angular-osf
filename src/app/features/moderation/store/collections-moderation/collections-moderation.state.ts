import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@core/handlers';
import { CollectionsService } from '@shared/services';

import {
  ClearCollectionModeration,
  CreateCollectionSubmissionAction,
  GetCollectionSubmissions,
  GetSubmissionsReviewActions,
  SetCurrentReviewAction,
  SetCurrentSubmission,
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
    const state = ctx.getState();
    ctx.patchState({
      collectionSubmissions: {
        ...state.collectionSubmissions,
        isLoading: true,
      },
    });

    return this.collectionsService
      .fetchCollectionSubmissionsByStatus(action.collectionId, action.status, action.page, action.sortBy)
      .pipe(
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
  getSubmissionsReviewActions(ctx: StateContext<CollectionsModerationStateModel>, action: GetSubmissionsReviewActions) {
    ctx.patchState({
      reviewActions: {
        ...ctx.getState().reviewActions,
        isLoading: true,
      },
    });

    return this.collectionsService.fetchCollectionSubmissionsActions(action.submissionId, action.collectionId).pipe(
      tap((res) => {
        const currentState = ctx.getState();
        ctx.patchState({
          reviewActions: {
            data: [...currentState.reviewActions.data, [...res]],
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'reviewActions', error))
    );
  }

  @Action(CreateCollectionSubmissionAction)
  createCollectionSubmissionAction(
    ctx: StateContext<CollectionsModerationStateModel>,
    action: CreateCollectionSubmissionAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      reviewActions: {
        ...state.reviewActions,
        isSubmitting: true,
      },
    });

    return this.collectionsService.createCollectionSubmissionAction(action.payload).pipe(
      tap(() => {
        ctx.patchState({
          reviewActions: {
            ...state.reviewActions,
            isSubmitting: false,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'reviewActions', error))
    );
  }

  @Action(SetCurrentSubmission)
  setCurrentSubmission(ctx: StateContext<CollectionsModerationStateModel>, action: SetCurrentSubmission) {
    ctx.patchState({
      currentSubmission: action.submission,
    });
  }

  @Action(SetCurrentReviewAction)
  setCurrentReviewAction(ctx: StateContext<CollectionsModerationStateModel>, action: SetCurrentReviewAction) {
    ctx.patchState({
      currentReviewAction: action.action,
    });
  }

  @Action(ClearCollectionModeration)
  clearCollectionModeration(ctx: StateContext<CollectionsModerationStateModel>) {
    ctx.setState(COLLECTIONS_MODERATION_STATE_DEFAULTS);
  }
}
