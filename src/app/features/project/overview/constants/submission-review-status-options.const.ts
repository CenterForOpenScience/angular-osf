import { SubmissionReviewStatus } from '@osf/features/moderation/enums';

export const SUBMISSION_REVIEW_STATUS_OPTIONS: Record<
  SubmissionReviewStatus | string,
  { label: string; severity: string }
> = {
  [SubmissionReviewStatus.Pending]: {
    label: 'project.overview.collectionsModeration.pending',
    severity: 'warn',
  },
  [SubmissionReviewStatus.Accepted]: {
    label: 'project.overview.collectionsModeration.accepted',
    severity: 'success',
  },
  [SubmissionReviewStatus.Rejected]: {
    label: 'project.overview.collectionsModeration.rejected',
    severity: 'error',
  },
  [SubmissionReviewStatus.Removed]: {
    label: 'project.overview.collectionsModeration.removed',
    severity: 'secondary',
  },
};
