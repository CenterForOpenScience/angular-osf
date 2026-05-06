import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';
import { CollectionSubmission } from '@osf/shared/models/collections/collections.model';

export const MOCK_PROJECT_COLLECTION_SUBMISSIONS: CollectionSubmission[] = [
  {
    id: '1',
    type: 'collection-submissions',
    collectionTitle: 'Collection A',
    collectionId: 'col1',
    reviewsState: CollectionSubmissionReviewState.Accepted,
  },
  {
    id: '2',
    type: 'collection-submissions',
    collectionTitle: 'Collection B',
    collectionId: 'col2',
    reviewsState: CollectionSubmissionReviewState.Pending,
  },
];
