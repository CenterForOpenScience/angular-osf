import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/core/handlers';

import { PreprintModerationService } from '../../services';

import { GetPreprintProviders, GetPreprintReviewActions } from './preprint-moderation.actions';
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

    return this.preprintModerationService.getPreprintProvidersToModerate().pipe(
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
}
