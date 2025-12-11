import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { CollectionsService } from '@osf/shared/services/collections.service';
import { DEFAULT_TABLE_PARAMS } from '@shared/constants/default-table-params.constants';
import { ResourceType } from '@shared/enums/resource-type.enum';
import { handleSectionError } from '@shared/helpers/state-error.handler';
import { ContributorsService } from '@shared/services/contributors.service';

import {
  ClearCollectionModeration,
  CreateCollectionSubmissionAction,
  GetCollectionSubmissionContributors,
  GetCollectionSubmissions,
  GetSubmissionsReviewActions,
  LoadMoreCollectionSubmissionContributors,
} from './collections-moderation.actions';
import { COLLECTIONS_MODERATION_STATE_DEFAULTS, CollectionsModerationStateModel } from './collections-moderation.model';

@State<CollectionsModerationStateModel>({
  name: 'collectionsModeration',
  defaults: COLLECTIONS_MODERATION_STATE_DEFAULTS,
})
@Injectable()
export class CollectionsModerationState {
  collectionsService = inject(CollectionsService);
  contributorsService = inject(ContributorsService);

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

  @Action(GetCollectionSubmissionContributors)
  getCollectionSubmissionContributors(
    ctx: StateContext<CollectionsModerationStateModel>,
    action: GetCollectionSubmissionContributors
  ) {
    const state = ctx.getState();
    const submission = state.collectionSubmissions.data.find((s) => s.id === action.collectionId);

    if (submission?.contributors && submission.contributors.length > 0 && action.page === 1) {
      return;
    }

    ctx.setState(
      patch({
        collectionSubmissions: {
          ...state.collectionSubmissions,
          isSubmitting: true,
        },
      })
    );
    return this.contributorsService
      .getBibliographicContributors(ResourceType.Project, action.collectionId, action.page, DEFAULT_TABLE_PARAMS.rows)
      .pipe(
        tap((res) => {
          const currentSubmission = state.collectionSubmissions.data.find((s) => s.id === action.collectionId);
          const existingContributors = currentSubmission?.contributors || [];
          const newContributors = action.page === 1 ? res.data : [...existingContributors, ...res.data];

          ctx.patchState({
            collectionSubmissions: {
              ...state.collectionSubmissions,
              data: state.collectionSubmissions.data.map((submission) =>
                submission.id === action.collectionId
                  ? {
                      ...submission,
                      contributors: newContributors,
                      totalContributors: res.totalCount,
                      contributorsLoading: false,
                      contributorsPage: action.page,
                    }
                  : submission
              ),
            },
          });
        }),
        catchError((error) => {
          ctx.patchState({
            collectionSubmissions: {
              ...state.collectionSubmissions,
              data: state.collectionSubmissions.data.map((submission) =>
                submission.id === action.collectionId
                  ? {
                      ...submission,
                      contributorsLoading: false,
                    }
                  : submission
              ),
            },
          });
          return handleSectionError(ctx, 'collectionSubmissions', error);
        })
      );
  }

  @Action(LoadMoreCollectionSubmissionContributors)
  loadMoreCollectionSubmissionContributors(
    ctx: StateContext<CollectionsModerationStateModel>,
    action: LoadMoreCollectionSubmissionContributors
  ) {
    const state = ctx.getState();
    const submission = state.collectionSubmissions.data.find((s) => s.id === action.collectionId);
    const currentPage = submission?.contributorsPage || 1;
    const nextPage = currentPage + 1;

    return ctx.dispatch(new GetCollectionSubmissionContributors(action.collectionId, nextPage));
  }
}
