import { LicenseModel } from '@shared/models';
import { AsyncStateModel } from '@shared/models/store';

export interface AddToCollectionStateModel {
  collectionLicenses: AsyncStateModel<LicenseModel[]>;
}
