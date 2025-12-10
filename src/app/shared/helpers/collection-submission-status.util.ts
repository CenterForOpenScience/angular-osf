import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';

import { SeverityType } from '../models/severity.type';

export const COLLECTION_SUBMISSION_STATUS_SEVERITY: Record<CollectionSubmissionReviewState, SeverityType> = {
  [CollectionSubmissionReviewState.Accepted]: 'success',
  [CollectionSubmissionReviewState.Rejected]: 'danger',
  [CollectionSubmissionReviewState.Pending]: 'warn',
  [CollectionSubmissionReviewState.InProgress]: 'warn',
  [CollectionSubmissionReviewState.Removed]: 'secondary',
};
