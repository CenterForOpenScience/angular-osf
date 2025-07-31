import { CollectionSubmissionReviewAction } from '@osf/features/moderation/models';
import { AsyncStateModel, AsyncStateWithTotalCount, CollectionSubmission } from '@shared/models';

export interface CollectionsModerationStateModel {
  collectionSubmissions: AsyncStateWithTotalCount<CollectionSubmission[]>;
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
