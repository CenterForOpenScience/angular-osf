import { LicenseModel } from '@shared/models/license/license.model';
import { AsyncStateModel } from '@shared/models/store/async-state.model';

export interface AddToCollectionStateModel {
  collectionLicenses: AsyncStateModel<LicenseModel[]>;
}
