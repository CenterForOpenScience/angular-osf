import { BannerModel } from '@core/components/osf-banners/models/banner.model';
import { AsyncStateModel } from '@shared/models/store';

/**
 * NGXS State model for managing banner-related data.
 *
 * Holds information about the current scheduled banner and its async state,
 * including loading and error status.
 */
export interface BannersStateModel {
  /**
   * The async state container for the currently scheduled banner.
   * - `data`: The actual `BannerModel` or `null` if not loaded.
   * - `isLoading`: Indicates if the banner is currently being fetched.
   * - `error`: Holds any error message if the fetch fails.
   */
  currentBanner: AsyncStateModel<BannerModel | null>;
}

/**
 * The default initial state for the `BannersState`.
 *
 * Used by NGXS to initialize the state when the application starts.
 */
export const BANNERS_DEFAULTS: BannersStateModel = {
  currentBanner: {
    data: null,
    isLoading: false,
    error: null,
  },
};
