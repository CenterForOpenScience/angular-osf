import { SubscriptionEvent } from '@shared/enums';

export const SUBSCRIPTION_EVENTS: {
  event: SubscriptionEvent;
  labelKey: string;
}[] = [
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
