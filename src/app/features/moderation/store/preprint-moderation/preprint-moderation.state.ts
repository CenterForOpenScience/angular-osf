import { Action, State, StateContext } from '@ngxs/store';
import { insertItem, patch, updateItem } from '@ngxs/store/operators';

import { catchError, forkJoin, map, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants';
import { ResourceType } from '@osf/shared/enums';
import { handleSectionError } from '@osf/shared/helpers';
import { ContributorsService } from '@osf/shared/services';

import { PreprintSubmissionModel, PreprintWithdrawalSubmission } from '../../models';
import { PreprintModerationService } from '../../services';

import {
  GetPreprintProvider,
  GetPreprintProviders,
  GetPreprintReviewActions,
  GetPreprintSubmissionContributors,
  GetPreprintSubmissions,
  GetPreprintWithdrawalSubmissionContributors,
  GetPreprintWithdrawalSubmissions,
} from './preprint-moderation.actions';
import { PREPRINT_MODERATION_STATE_DEFAULTS, PreprintModerationStateModel } from './preprint-moderation.model';

@State<PreprintModerationStateModel>({
  name: 'preprintModeration',
  defaults: PREPRINT_MODERATION_STATE_DEFAULTS,
})
@Injectable()
export class PreprintModerationState {
  private readonly preprintModerationService = inject(PreprintModerationService);
  private readonly contributorsService = inject(ContributorsService);

  @Action(GetPreprintProviders)
  getPreprintProviders(ctx: StateContext<PreprintModerationStateModel>) {
    ctx.setState(patch({ preprintProviders: patch({ isLoading: true }) }));

    return this.preprintModerationService.getPreprintProviders().pipe(
      switchMap((items) =>
        forkJoin(
          items.map((item) =>
            this.preprintModerationService.getPreprintProvider(item.id).pipe(
              map((res) => ({
                ...item,
                submissionCount: res.submissionCount,
              }))
            )
          )
        )
      ),
      tap((data) => {
        ctx.setState(
          patch({
            preprintProviders: patch({
              data: data,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'preprintProviders', error))
    );
  }

  @Action(GetPreprintReviewActions)
  getPreprintReviewActions(ctx: StateContext<PreprintModerationStateModel>, { page }: GetPreprintReviewActions) {
    ctx.setState(patch({ reviewActions: patch({ isLoading: true }) }));

    return this.preprintModerationService.getPreprintReviews(page).pipe(
      tap((res) => {
        ctx.setState(
          patch({
            reviewActions: patch({
              data: res.data,
              isLoading: false,
              totalCount: res.totalCount,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'reviewActions', error))
    );
  }

  @Action(GetPreprintProvider)
  getPreprintProvider(ctx: StateContext<PreprintModerationStateModel>, { providerId }: GetPreprintProvider) {
    ctx.setState(patch({ preprintProviders: patch({ isLoading: true }) }));

    return this.preprintModerationService.getPreprintProvider(providerId).pipe(
      tap((data) => {
        const exists = ctx.getState().preprintProviders.data.some((p) => p.id === data.id);

        ctx.setState(
          patch({
            preprintProviders: patch({
              data: exists ? updateItem((p) => p.id === data.id, data) : insertItem(data),
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'preprintProviders', error))
    );
  }

  @Action(GetPreprintSubmissions)
  getPreprintSubmissions(
    ctx: StateContext<PreprintModerationStateModel>,
    { provider, status, page, sort }: GetPreprintSubmissions
  ) {
    ctx.setState(patch({ submissions: patch({ isLoading: true }) }));

    return this.preprintModerationService.getPreprintSubmissions(provider, status, page, sort).pipe(
      tap((res) => {
        ctx.setState(
          patch({
            submissions: patch({
              data: res.data,
              isLoading: false,
              totalCount: res.totalCount,
              acceptedCount: res.acceptedCount,
              rejectedCount: res.rejectedCount,
              pendingCount: res.pendingCount,
              withdrawnCount: res.withdrawnCount,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'submissions', error))
    );
  }

  @Action(GetPreprintWithdrawalSubmissions)
  getPreprintWithdrawalSubmissions(
    ctx: StateContext<PreprintModerationStateModel>,
    { provider, status, page, sort }: GetPreprintWithdrawalSubmissions
  ) {
    ctx.setState(patch({ withdrawalSubmissions: patch({ isLoading: true }) }));

    return this.preprintModerationService.getPreprintWithdrawalSubmissions(provider, status, page, sort).pipe(
      tap((res) => {
        ctx.setState(
          patch({
            withdrawalSubmissions: patch({
              data: res.data,
              isLoading: false,
              totalCount: res.totalCount,
              acceptedCount: res.acceptedCount,
              rejectedCount: res.rejectedCount,
              pendingCount: res.pendingCount,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'withdrawalSubmissions', error))
    );
  }

  @Action(GetPreprintSubmissionContributors)
  getPreprintSubmissionContributors(
    ctx: StateContext<PreprintModerationStateModel>,
    { preprintId }: GetPreprintSubmissionContributors
  ) {
    const state = ctx.getState();
    const submission = state.submissions.data.find((s) => s.id === preprintId);

    if (submission?.contributors && submission.contributors.length > 0) {
      return;
    }

    ctx.setState(
      patch({
        submissions: patch({
          data: updateItem<PreprintSubmissionModel>(
            (submission) => submission.id === preprintId,
            patch({ contributorsLoading: true })
          ),
        }),
      })
    );

    return this.contributorsService
      .getAllContributors(ResourceType.Preprint, preprintId, 1, DEFAULT_TABLE_PARAMS.rows)
      .pipe(
        tap((res) => {
          ctx.setState(
            patch({
              submissions: patch({
                data: updateItem<PreprintSubmissionModel>(
                  (submission) => submission.id === preprintId,
                  patch({
                    contributors: res.data,
                    totalContributors: res.totalCount,
                    contributorsLoading: false,
                  })
                ),
              }),
            })
          );
        }),
        catchError((error) => {
          ctx.setState(
            patch({
              submissions: patch({
                data: updateItem<PreprintSubmissionModel>(
                  (submission) => submission.id === preprintId,
                  patch({ contributorsLoading: false })
                ),
              }),
            })
          );

          return handleSectionError(ctx, 'submissions', error);
        })
      );
  }

  @Action(GetPreprintWithdrawalSubmissionContributors)
  getPreprintWithdrawalSubmissionContributors(
    ctx: StateContext<PreprintModerationStateModel>,
    { submissionId, preprintId }: GetPreprintWithdrawalSubmissionContributors
  ) {
    const state = ctx.getState();
    const submission = state.withdrawalSubmissions.data.find((s) => s.id === submissionId);

    if (submission?.contributors && submission.contributors.length > 0) {
      return;
    }

    ctx.setState(
      patch({
        withdrawalSubmissions: patch({
          data: updateItem<PreprintWithdrawalSubmission>(
            (submission) => submission.id === submissionId,
            patch({ contributorsLoading: true })
          ),
        }),
      })
    );

    return this.contributorsService
      .getAllContributors(ResourceType.Preprint, preprintId, 1, DEFAULT_TABLE_PARAMS.rows)
      .pipe(
        tap((res) => {
          ctx.setState(
            patch({
              withdrawalSubmissions: patch({
                data: updateItem<PreprintWithdrawalSubmission>(
                  (submission) => submission.id === submissionId,
                  patch({
                    contributors: res.data,
                    totalContributors: res.totalCount,
                    contributorsLoading: false,
                  })
                ),
              }),
            })
          );
        }),
        catchError((error) => {
          ctx.setState(
            patch({
              withdrawalSubmissions: patch({
                data: updateItem<PreprintWithdrawalSubmission>(
                  (submission) => submission.id === submissionId,
                  patch({ contributorsLoading: false })
                ),
              }),
            })
          );

          return handleSectionError(ctx, 'withdrawalSubmissions', error);
        })
      );
  }
}
