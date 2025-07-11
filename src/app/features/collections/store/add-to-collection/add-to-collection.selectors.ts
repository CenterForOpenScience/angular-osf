import { Selector } from '@ngxs/store';

import { AddToCollectionStateModel } from './add-to-collection.model';
import { AddToCollectionState } from './add-to-collection.state';

export class AddToCollectionSelectors {
  @Selector([AddToCollectionState])
  static getCollectionLicenses(state: AddToCollectionStateModel) {
    return state.collectionLicenses.data;
  }

  @Selector([AddToCollectionState])
  static getCollectionLicensesLoading(state: AddToCollectionStateModel) {
    return state.collectionLicenses.isLoading;
  }
}
