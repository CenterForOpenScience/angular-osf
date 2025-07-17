import { Action, State, StateContext } from '@ngxs/store';
import { insertItem, patch, updateItem } from '@ngxs/store/operators';

import { catchError, forkJoin, map, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/core/handlers';

import { PreprintModerationService } from '../../services';

import { GetPreprintProvider, GetPreprintProviders, GetPreprintReviewActions } from './preprint-moderation.actions';
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
}
