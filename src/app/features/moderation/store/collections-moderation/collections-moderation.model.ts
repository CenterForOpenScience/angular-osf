import { CollectionSubmissionReviewAction } from '@osf/features/moderation/models';
import { AsyncStateModel, AsyncStateWithTotalCount, CollectionSubmission } from '@shared/models';

export interface CollectionsModerationStateModel {
  collectionSubmissions: AsyncStateWithTotalCount<CollectionSubmission[]>;
  reviewActions: AsyncStateModel<CollectionSubmissionReviewAction[][]>;
  currentSubmission: CollectionSubmission | null;
  currentReviewAction: CollectionSubmissionReviewAction | null;
}

export const COLLECTIONS_MODERATION_STATE_DEFAULTS: CollectionsModerationStateModel = {
  collectionSubmissions: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
  reviewActions: {
    data: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  currentSubmission: null,
  currentReviewAction: null,
};
