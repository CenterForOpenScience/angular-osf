import { Banner } from '@osf/shared/models/banners.model';
import { AsyncStateModel } from '@shared/models/store';

export interface BannersStateModel {
  currentBanner: AsyncStateModel<Banner>;
}
