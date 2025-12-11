import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';

import { CustomOption } from '../models/select-option.model';
import { SeverityType } from '../models/severity.type';

export const COLLECTION_SUBMISSION_STATUS_SEVERITY: Record<
  CollectionSubmissionReviewState,
  CustomOption<SeverityType>
> = {
  [CollectionSubmissionReviewState.Accepted]: { label: 'moderation.submissionReviewStatus.approved', value: 'success' },
  [CollectionSubmissionReviewState.Rejected]: { label: 'moderation.submissionReviewStatus.rejected', value: 'danger' },
  [CollectionSubmissionReviewState.Pending]: { label: 'moderation.submissionReviewStatus.pending', value: 'warn' },
  [CollectionSubmissionReviewState.InProgress]: {
    label: 'moderation.submissionReviewStatus.inProgress',
    value: 'warn',
  },
  [CollectionSubmissionReviewState.Removed]: { label: 'moderation.submissionReviewStatus.removed', value: 'secondary' },
};
