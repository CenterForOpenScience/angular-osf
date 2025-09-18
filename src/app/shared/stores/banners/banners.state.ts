import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { BannerModel } from '@core/components/osf-banners/models/banner.model';
import { handleSectionError } from '@osf/shared/helpers';
import { BannersService } from '@osf/shared/services/banners.service';

import { GetCurrentScheduledBanner } from './banners.actions';
import { BANNERS_DEFAULTS, BannersStateModel } from './banners.model';

/**
 * NGXS state for managing scheduled banner data.
 *
 * This state handles:
 * - Fetching the current scheduled banner from the backend
 * - Storing banner data, loading states, and error states
 */
@State<BannersStateModel>({
  name: 'banners',
  defaults: BANNERS_DEFAULTS,
})
@Injectable()
export class BannersState {
  /**
   * Injected service responsible for fetching banner data.
   */
  bannersService = inject(BannersService);

  /**
   * Action handler for `GetCurrentScheduledBanner`.
   *
   * Updates the `currentBanner` state to indicate loading, then gets the banner schedule.
   * On success, updates the state with the banner data.
   * On failure, calls `handleSectionError()` to record the error and update the state.
   *
   * @param ctx - NGXS state context for managing `BannersStateModel`.
   * @returns An observable of the get operation, patched into state on success or failure.
   */
  @Action(GetCurrentScheduledBanner)
  getCurrentScheduledBanner(ctx: StateContext<BannersStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      currentBanner: {
        ...state.currentBanner,
        isLoading: true,
      },
    });

    return this.bannersService.getCurrentBanner().pipe(
      tap((scheduledBanner: BannerModel) => {
        ctx.patchState({
          currentBanner: {
            data: scheduledBanner,
            isLoading: false,
            error: null,
          },
        });
      }),
      catchError((error) => handleSectionError(ctx, 'currentBanner', error))
    );
  }
}
