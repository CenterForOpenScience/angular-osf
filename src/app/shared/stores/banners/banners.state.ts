import { Action, State, StateContext } from '@ngxs/store';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { BannersService } from '@osf/shared/services/banners.service';

import { FetchCurrentScheduledBanners } from './banners.actions';
import { BannersStateModel } from './banners.model';

@State<BannersStateModel>({
  name: 'banners',
})
@Injectable()
export class BannersState {
  bannerService = inject(BannersService);

  @Action(FetchCurrentScheduledBanners)
  fetchCurrentScheduledBanner(ctx: StateContext<BannersStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      currentBanner: {
        ...state.currentBanner,
        isLoading: true,
      },
    });
    return this.bannerService.fetchCurrentBanner().pipe(
      tap((newValue) => {
        ctx.patchState({
          currentBanner: {
            data: newValue,
            isLoading: false,
            error: null,
          },
        });
      })
    );
  }
}
