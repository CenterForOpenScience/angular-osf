import { Selector } from '@ngxs/store';

import { BannersStateModel } from './banners.model';
import { BannersState } from './banners.state';

export class BannersSelector {
  @Selector([BannersState])
  static getCurrentBanner(state: BannersStateModel) {
    return state.currentBanner.data;
  }

  @Selector([BannersState])
  static getCurrentBannerIsLoading(state: BannersStateModel) {
    return state.currentBanner.isLoading;
  }
}
