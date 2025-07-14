import { License } from '@shared/models';
import { AsyncStateModel } from '@shared/models/store';

export interface AddToCollectionStateModel {
  collectionLicenses: AsyncStateModel<License[]>;
}
