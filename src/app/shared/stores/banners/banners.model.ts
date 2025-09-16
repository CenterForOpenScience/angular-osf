import { BannerModel } from '@osf/shared/models/banner.model';
import { AsyncStateModel } from '@shared/models/store';

export interface BannersStateModel {
  currentBanner: AsyncStateModel<BannerModel | null>;
}

export const BANNERS_DEFAULTS: BannersStateModel = {
  currentBanner: {
    data: null,
    isLoading: false,
    error: null,
  },
};
