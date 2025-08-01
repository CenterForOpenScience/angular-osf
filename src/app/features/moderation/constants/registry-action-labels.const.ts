import { ActionStatus } from '../enums';

export const REGISTRY_ACTION_LABEL: Record<ActionStatus | string, string> = {
  [ActionStatus.Accepted]: 'moderation.registryAccepted',
  [ActionStatus.Pending]: 'moderation.registrySubmitted',
  [ActionStatus.PendingWithdraw]: 'moderation.registryWithdrawalRequested',
  [ActionStatus.Withdrawn]: 'moderation.registryWithdrawalAccepted',
  [ActionStatus.Rejected]: 'moderation.registryRejected',
};
