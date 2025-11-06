import { CollectionSubmissionReviewAction } from '@osf/features/moderation/models';
import { CollectionSubmissionWithGuid } from '@osf/shared/models/collections/collections.models';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';
import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

export interface CollectionsModerationStateModel {
  collectionSubmissions: AsyncStateWithTotalCount<CollectionSubmissionWithGuid[]>;
  currentReviewAction: AsyncStateModel<CollectionSubmissionReviewAction | null>;
}

export const COLLECTIONS_MODERATION_STATE_DEFAULTS: CollectionsModerationStateModel = {
  collectionSubmissions: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
  currentReviewAction: {
    data: null,
    isLoading: false,
    error: null,
  },
};
