import { Selector } from '@ngxs/store';

import { BannerModel } from '@core/components/osf-banners/models/banner.model';

import { BannersStateModel } from './banners.model';
import { BannersState } from './banners.state';

/**
 * Selectors for accessing parts of the BannersState.
 *
 * Provides reusable, memoized accessors for banner data, loading state, and other
 * UI-related banner metadata stored in NGXS.
 */
export class BannersSelector {
  /**
   * Selects the current scheduled banner data from the state.
   *
   * @param state - The current state of the `banners` NGXS module.
   * @returns The `BannerModel` if set, otherwise `null`.
   */
  @Selector([BannersState])
  static getCurrentBanner(state: BannersStateModel): BannerModel | null {
    return state.currentBanner.data;
  }

  /**
   * Selects the loading status for the current banner request.
   *
   * @param state - The current state of the `banners` NGXS module.
   * @returns A boolean indicating whether the banner is being fetched.
   */
  @Selector([BannersState])
  static getCurrentBannerIsLoading(state: BannersStateModel): boolean {
    return state.currentBanner.isLoading;
  }
}
