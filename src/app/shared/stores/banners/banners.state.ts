import { Action, State, StateContext } from '@ngxs/store';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';
import { BannersService } from '@osf/shared/services/banners.service';

import { FetchCurrentScheduledBanner } from './banners.actions';
import { BANNERS_DEFAULTS, BannersStateModel } from './banners.model';

@State<BannersStateModel>({
  name: 'banners',
  defaults: BANNERS_DEFAULTS,
})
@Injectable()
export class BannersState {
  bannersService = inject(BannersService);

  @Action(FetchCurrentScheduledBanner)
  fetchCurrentScheduledBanner(ctx: StateContext<BannersStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      currentBanner: {
        ...state.currentBanner,
        isLoading: true,
      },
    });
    return this.bannersService.fetchCurrentBanner().pipe(
      tap((newValue) => {
        ctx.patchState({
          currentBanner: {
            data: newValue,
            isLoading: false,
            error: null,
          },
        });
        catchError((error) => handleSectionError(ctx, 'currentBanner', error));
      })
    );
  }
}
