import { SubmissionReviewStatus } from '../enums';

export const SUBMISSION_REVIEW_OPTIONS = [
  {
    value: SubmissionReviewStatus.Pending,
    icon: 'fas fa-hourglass',
    label: 'moderation.submissionReviewStatus.pending',
  },
  {
    value: SubmissionReviewStatus.Accepted,
    icon: 'fas fa-circle-check',
    label: 'moderation.submissionReviewStatus.accepted',
  },
  {
    value: SubmissionReviewStatus.Rejected,
    icon: 'fas fa-circle-xmark',
    label: 'moderation.submissionReviewStatus.rejected',
  },
  {
    value: SubmissionReviewStatus.Withdrawn,
    icon: 'fas fa-circle-minus',
    label: 'moderation.submissionReviewStatus.withdrawn',
  },
];

export const ReviewStatusIcon: Record<SubmissionReviewStatus, { value: string; icon: string }> = {
  [SubmissionReviewStatus.Pending]: {
    value: SubmissionReviewStatus.Pending,
    icon: 'fas fa-hourglass',
  },
  [SubmissionReviewStatus.Accepted]: {
    value: SubmissionReviewStatus.Accepted,
    icon: 'fas fa-circle-check',
  },
  [SubmissionReviewStatus.Rejected]: {
    value: SubmissionReviewStatus.Rejected,
    icon: 'fas fa-circle-xmark',
  },
  [SubmissionReviewStatus.Withdrawn]: {
    value: SubmissionReviewStatus.Withdrawn,
    icon: 'fas fa-circle-minus',
  },
};
