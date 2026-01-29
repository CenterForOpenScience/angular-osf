import { CollectionProjectSubmission } from '@osf/shared/models/collections/collections.models';
import { LicenseModel } from '@shared/models/license/license.model';
import { AsyncStateModel } from '@shared/models/store/async-state.model';

export interface AddToCollectionStateModel {
  collectionLicenses: AsyncStateModel<LicenseModel[]>;
  currentProjectSubmission: AsyncStateModel<CollectionProjectSubmission | null>;
}

export const ADD_TO_COLLECTION_DEFAULTS: AddToCollectionStateModel = {
  collectionLicenses: {
    data: [],
    isLoading: false,
    error: null,
  },
  currentProjectSubmission: {
    data: null,
    isLoading: false,
    error: null,
  },
};
