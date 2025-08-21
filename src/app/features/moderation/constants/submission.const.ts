import { SubmissionReviewStatus } from '../enums';
import { SubmissionReviewOption } from '../models';

export const SUBMISSION_REVIEW_OPTIONS: SubmissionReviewOption[] = [
  {
    value: SubmissionReviewStatus.Pending,
    icon: 'fas fa-hourglass',
    label: 'moderation.submissionReviewStatus.pending',
    count: 0,
  },
  {
    value: SubmissionReviewStatus.Accepted,
    icon: 'fas fa-circle-check',
    label: 'moderation.submissionReviewStatus.accepted',
    count: 0,
  },
  {
    value: SubmissionReviewStatus.Rejected,
    icon: 'fas fa-circle-xmark',
    label: 'moderation.submissionReviewStatus.rejected',
    count: 0,
  },
  {
    value: SubmissionReviewStatus.Withdrawn,
    icon: 'fas fa-circle-minus',
    label: 'moderation.submissionReviewStatus.withdrawn',
    count: 0,
  },
];

export const COLLECTIONS_SUBMISSIONS_REVIEW_OPTIONS: SubmissionReviewOption[] = [
  {
    value: SubmissionReviewStatus.Pending,
    icon: 'fas fa-hourglass',
    label: 'moderation.submissionReviewStatus.pending',
    count: 0,
  },
  {
    value: SubmissionReviewStatus.Accepted,
    icon: 'fas fa-circle-check',
    label: 'moderation.submissionReviewStatus.accepted',
    count: 0,
  },
  {
    value: SubmissionReviewStatus.Rejected,
    icon: 'fas fa-circle-xmark',
    label: 'moderation.submissionReviewStatus.rejected',
    count: 0,
  },
  {
    value: SubmissionReviewStatus.Removed,
    icon: 'fas fa-circle-minus',
    label: 'moderation.submissionReviewStatus.withdrawn',
    count: 0,
  },
];

export const WITHDRAWAL_SUBMISSION_REVIEW_OPTIONS: SubmissionReviewOption[] = [
  {
    value: SubmissionReviewStatus.Pending,
    icon: 'fas fa-hourglass',
    label: 'moderation.submissionReviewStatus.pending',
    count: 0,
  },
  {
    value: SubmissionReviewStatus.Accepted,
    icon: 'fas fa-circle-check',
    label: 'moderation.submissionReviewStatus.approved',
    count: 0,
  },
  {
    value: SubmissionReviewStatus.Rejected,
    icon: 'fas fa-circle-minus',
    label: 'moderation.submissionReviewStatus.declined',
    count: 0,
  },
];

export const SUBMITTED_SUBMISSION_REVIEW_OPTIONS: SubmissionReviewOption[] = [
  {
    value: SubmissionReviewStatus.Accepted,
    icon: 'fas fa-circle-check',
    label: 'moderation.submissionReviewStatus.public',
  },
  {
    value: SubmissionReviewStatus.Embargo,
    icon: 'fas fa-lock',
    label: 'moderation.submissionReviewStatus.embargo',
  },
  {
    value: SubmissionReviewStatus.Rejected,
    icon: 'fas fa-circle-xmark',
    label: 'moderation.submissionReviewStatus.rejected',
  },
  {
    value: SubmissionReviewStatus.Removed,
    icon: 'fas fa-circle-minus',
    label: 'moderation.submissionReviewStatus.withdrawn',
  },
];

export const PENDING_SUBMISSION_REVIEW_OPTIONS: SubmissionReviewOption[] = [
  {
    value: SubmissionReviewStatus.Pending,
    icon: 'fas fa-hourglass',
    label: 'moderation.submissionReviewStatus.pending',
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

export const ReviewStatusIcon: Record<SubmissionReviewStatus | string, { value: string; icon: string }> = {
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
  [SubmissionReviewStatus.Removed]: {
    value: SubmissionReviewStatus.Removed,
    icon: 'fas fa-circle-minus',
  },
  [SubmissionReviewStatus.Public]: {
    value: SubmissionReviewStatus.Public,
    icon: 'fas fa-circle-check',
  },
  [SubmissionReviewStatus.Embargo]: {
    value: SubmissionReviewStatus.Embargo,
    icon: 'fas fa-lock',
  },
  [SubmissionReviewStatus.PendingWithdrawal]: {
    value: SubmissionReviewStatus.PendingWithdrawal,
    icon: 'fas fa-circle-minus',
  },
  [SubmissionReviewStatus.PendingUpdates]: {
    value: SubmissionReviewStatus.PendingUpdates,
    icon: 'fas fa-hourglass',
  },
};
