import { SubmissionReviewStatus } from '../enums';

export const PreprintReviewStatus: Record<SubmissionReviewStatus | string, { label: string }> = {
  [SubmissionReviewStatus.Pending]: {
    label: 'moderation.preprintReviewStatus.submitted',
  },
  [SubmissionReviewStatus.Accepted]: {
    label: 'moderation.preprintReviewStatus.accepted',
  },
  [SubmissionReviewStatus.Rejected]: {
    label: 'moderation.preprintReviewStatus.rejected',
  },
  [SubmissionReviewStatus.Withdrawn]: {
    label: 'moderation.preprintReviewStatus.withdrawn',
  },
};
