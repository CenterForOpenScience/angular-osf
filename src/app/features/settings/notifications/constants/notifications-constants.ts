import { SubscriptionEvent } from '@shared/enums';

import { SubscriptionEventModel } from '../models';

export const SUBSCRIPTION_EVENTS: SubscriptionEventModel[] = [
  {
    event: SubscriptionEvent.GlobalCommentReplies,
    labelKey: 'settings.notifications.notificationPreferences.items.replies',
  },
  {
    event: SubscriptionEvent.GlobalComments,
    labelKey: 'settings.notifications.notificationPreferences.items.comments',
  },
  {
    event: SubscriptionEvent.GlobalFileUpdated,
    labelKey: 'settings.notifications.notificationPreferences.items.files',
  },
  {
    event: SubscriptionEvent.GlobalMentions,
    labelKey: 'settings.notifications.notificationPreferences.items.mentions',
  },
  {
    event: SubscriptionEvent.GlobalReviews,
    labelKey: 'settings.notifications.notificationPreferences.items.preprints',
  },
];
