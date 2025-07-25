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

export const SUBMITTED_SUBMISSION_REVIEW_OPTIONS = [
  {
    value: SubmissionReviewStatus.Public,
    icon: 'fas fa-circle-check',
    label: 'moderation.submissionReviewStatus.public',
  },
  {
    value: SubmissionReviewStatus.Embargo,
    icon: 'fas fa-lock-open',
    label: 'moderation.submissionReviewStatus.embargo',
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

export const PENDING_SUBMISSION_REVIEW_OPTIONS = [
  {
    value: SubmissionReviewStatus.Pending,
    icon: 'fas fa-hourglass',
    label: 'moderation.submissionReviewStatus.pending',
    description: 'moderation.registrySubmitted',
  },
  {
    value: SubmissionReviewStatus.PendingUpdates,
    icon: 'fas fa-hourglass',
    label: 'moderation.submissionReviewStatus.pendingUpdates',
  },
  {
    value: SubmissionReviewStatus.PendingWithdrawal,
    icon: 'fas fa-circle-minus',
    label: 'moderation.submissionReviewStatus.pendingWithdrawal',
  },
];

export const ReviewStatusIcon: Record<
  SubmissionReviewStatus | string,
  { value: string; icon: string; description: string }
> = {
  [SubmissionReviewStatus.Pending]: {
    value: SubmissionReviewStatus.Pending,
    icon: 'fas fa-hourglass',
    description: 'moderation.registrySubmitted',
  },
  [SubmissionReviewStatus.Accepted]: {
    value: SubmissionReviewStatus.Accepted,
    icon: 'fas fa-circle-check',
    description: 'moderation.registryAccepted',
  },
  [SubmissionReviewStatus.Rejected]: {
    value: SubmissionReviewStatus.Rejected,
    icon: 'fas fa-circle-xmark',
    description: 'moderation.registryRejected',
  },
  [SubmissionReviewStatus.Withdrawn]: {
    value: SubmissionReviewStatus.Withdrawn,
    icon: 'fas fa-circle-minus',
    description: 'moderation.registryWithdrawal',
  },
  [SubmissionReviewStatus.Public]: {
    value: SubmissionReviewStatus.Public,
    icon: 'fas fa-lock',
    description: 'moderation.registryAccepted',
  },
  [SubmissionReviewStatus.Embargo]: {
    value: SubmissionReviewStatus.Embargo,
    icon: 'fas fa-lock-open',
    description: 'moderation.registryAccepted',
  },
  [SubmissionReviewStatus.PendingWithdrawal]: {
    value: SubmissionReviewStatus.PendingWithdrawal,
    icon: 'fas fa-circle-minus',
    description: 'moderation.registrySubmitted',
  },
  [SubmissionReviewStatus.PendingUpdates]: {
    value: SubmissionReviewStatus.PendingUpdates,
    icon: 'fas fa-hourglass',
    description: 'moderation.registrySubmitted',
  },
};
