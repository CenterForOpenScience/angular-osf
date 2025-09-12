import { BannerModel } from '@osf/shared/models/banner.model';
import { AsyncStateModel } from '@shared/models/store';

export interface BannersStateModel {
  currentBanner: AsyncStateModel<BannerModel>;
}
