import { TabOption } from '@osf/shared/models';

import { PreprintModerationTab } from '../enums';

export const PREPRINT_MODERATION_TABS: TabOption[] = [
  { label: 'moderation.submissions', value: PreprintModerationTab.Submissions },
  { label: 'moderation.withdrawalRequest', value: PreprintModerationTab.WithdrawalRequests },
  { label: 'moderation.moderators', value: PreprintModerationTab.Moderators },
  { label: 'moderation.notifications', value: PreprintModerationTab.Notifications },
  { label: 'moderation.settings', value: PreprintModerationTab.Settings },
];

export const PREPRINT_REVIEWING_TABS: TabOption[] = [
  { label: 'moderation.submissions', value: PreprintModerationTab.Submissions },
  { label: 'moderation.moderators', value: PreprintModerationTab.Moderators },
  { label: 'moderation.notifications', value: PreprintModerationTab.Notifications },
  { label: 'moderation.settings', value: PreprintModerationTab.Settings },
];
