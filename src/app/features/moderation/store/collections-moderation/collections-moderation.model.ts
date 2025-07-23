import { CollectionReviewAction } from '@osf/features/moderation/models';
import { AsyncStateModel, AsyncStateWithTotalCount, CollectionSubmission } from '@shared/models';

export interface CollectionsModerationStateModel {
  collectionSubmissions: AsyncStateModel<CollectionSubmission[]>;
  reviewActions: AsyncStateWithTotalCount<CollectionReviewAction[]>;
}

export const COLLECTIONS_MODERATION_STATE_DEFAULTS: CollectionsModerationStateModel = {
  collectionSubmissions: {
    data: [],
    isLoading: false,
    error: null,
  },
  reviewActions: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
};
