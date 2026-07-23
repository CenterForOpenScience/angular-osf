import { CollectionProvider } from '@osf/shared/models/collections/collection-provider.model';
import {
  CollectionSubmission,
  CollectionSubmissionWithGuid,
} from '@osf/shared/models/collections/collection-submissions.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

export interface CollectionsStateModel {
  collectionProvider: AsyncStateModel<CollectionProvider | null>;
  userCollectionSubmissions: AsyncStateModel<CollectionSubmissionWithGuid[]>;
  currentProjectSubmissions: AsyncStateModel<CollectionSubmission[]>;
}

export const COLLECTIONS_DEFAULTS: CollectionsStateModel = {
  collectionProvider: {
    data: null,
    isLoading: false,
    error: null,
  },
  userCollectionSubmissions: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  currentProjectSubmissions: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
};
