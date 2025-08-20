import { Action, State, StateContext } from '@ngxs/store';
import { insertItem, patch, updateItem } from '@ngxs/store/operators';

import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';

import { PreprintSubmissionPaginatedData, PreprintWithdrawalPaginatedData } from '../../models';
import { PreprintModerationService } from '../../services';

import {
  GetPreprintProvider,
  GetPreprintProviders,
  GetPreprintReviewActions,
  GetPreprintSubmissions,
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
      switchMap((res) => {
        if (!res.data.length) {
          return of({
            ...res,
            data: [],
          });
        }

        const actionRequests = res.data.map((item) =>
          this.preprintModerationService.getPreprintSubmissionReviewAction(item.id)
        );

        return forkJoin(actionRequests).pipe(
          map(
            (actions) =>
              ({
                ...res,
                data: res.data.map((item, i) => ({ ...item, actions: actions[i] })),
              }) as PreprintSubmissionPaginatedData
          )
        );
      }),
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
      switchMap((res) => {
        if (!res.data.length) {
          return of({
            ...res,
            data: [],
          });
        }

        const actionRequests = res.data.map((item) =>
          this.preprintModerationService.getPreprintWithdrawalSubmissionReviewAction(item.id)
        );

        return forkJoin(actionRequests).pipe(
          map(
            (actions) =>
              ({
                ...res,
                data: res.data.map((item, i) => ({ ...item, actions: actions[i] })),
              }) as PreprintWithdrawalPaginatedData
          )
        );
      }),
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
}
