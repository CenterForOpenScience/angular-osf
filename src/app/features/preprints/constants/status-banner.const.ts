import { ProviderReviewsWorkflow, ReviewsState } from '@osf/features/preprints/enums';

export type StatusSeverity = 'warn' | 'secondary' | 'success' | 'error';

export const statusLabelKeyByState: Partial<Record<ReviewsState, string>> = {
  [ReviewsState.Pending]: 'preprints.details.statusBanner.pending',
  [ReviewsState.Accepted]: 'preprints.details.statusBanner.accepted',
  [ReviewsState.Rejected]: 'preprints.details.statusBanner.rejected',
  [ReviewsState.PendingWithdrawal]: 'preprints.details.statusBanner.pendingWithdrawal',
  [ReviewsState.WithdrawalRejected]: 'preprints.details.statusBanner.withdrawalRejected',
  [ReviewsState.Withdrawn]: 'preprints.details.statusBanner.withdrawn',
};

export const statusIconByState: Partial<Record<ReviewsState, string>> = {
  [ReviewsState.Pending]: 'hourglass',
  [ReviewsState.Accepted]: 'check-circle',
  [ReviewsState.Rejected]: 'times-circle',
  [ReviewsState.PendingWithdrawal]: 'hourglass',
  [ReviewsState.WithdrawalRejected]: 'times-circle',
  [ReviewsState.Withdrawn]: 'circle-minus',
};

export const statusMessageByWorkflow: Record<ProviderReviewsWorkflow, string> = {
  [ProviderReviewsWorkflow.PreModeration]: 'preprints.details.statusBanner.messages.pendingPreModeration',
  [ProviderReviewsWorkflow.PostModeration]: 'preprints.details.statusBanner.messages.pendingPostModeration',
};

export const statusMessageByState: Partial<Record<ReviewsState, string>> = {
  [ReviewsState.Accepted]: 'preprints.details.statusBanner.messages.accepted',
  [ReviewsState.Rejected]: 'preprints.details.statusBanner.messages.rejected',
  [ReviewsState.PendingWithdrawal]: 'preprints.details.statusBanner.messages.pendingWithdrawal',
  [ReviewsState.WithdrawalRejected]: 'preprints.details.statusBanner.messages.withdrawalRejected',
  [ReviewsState.Withdrawn]: 'preprints.details.statusBanner.messages.withdrawn',
};

export const statusSeverityByWorkflow: Record<ProviderReviewsWorkflow, StatusSeverity> = {
  [ProviderReviewsWorkflow.PreModeration]: 'warn',
  [ProviderReviewsWorkflow.PostModeration]: 'secondary',
};

export const statusSeverityByState: Partial<Record<ReviewsState, StatusSeverity>> = {
  [ReviewsState.Accepted]: 'success',
  [ReviewsState.Rejected]: 'error',
  [ReviewsState.PendingWithdrawal]: 'error',
  [ReviewsState.WithdrawalRejected]: 'error',
  [ReviewsState.Withdrawn]: 'warn',
  [ReviewsState.Pending]: 'warn',
};

type ActivityMap = Partial<Record<ReviewsState, string>>;

export const recentActivityMessageByState: ActivityMap & {
  automatic: ActivityMap;
} = {
  [ReviewsState.Pending]: 'preprints.details.moderationStatusBanner.recentActivity.pending',
  [ReviewsState.Accepted]: 'preprints.details.moderationStatusBanner.recentActivity.accepted',
  [ReviewsState.Rejected]: 'preprints.details.moderationStatusBanner.recentActivity.rejected',
  [ReviewsState.PendingWithdrawal]: 'preprints.details.moderationStatusBanner.recentActivity.pendingWithdrawal',
  [ReviewsState.Withdrawn]: 'preprints.details.moderationStatusBanner.recentActivity.withdrawn',
  automatic: {
    [ReviewsState.Pending]: 'preprints.details.moderationStatusBanner.recentActivity.automatic.pending',
    [ReviewsState.Accepted]: 'preprints.details.moderationStatusBanner.recentActivity.automatic.accepted',
  },
};
