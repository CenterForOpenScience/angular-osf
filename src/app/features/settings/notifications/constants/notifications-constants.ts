import { SubscriptionEvent } from '@osf/shared/enums/subscriptions/subscription-event.enum';

import { SubscriptionEventModel } from '../models';

export const SUBSCRIPTION_EVENTS: SubscriptionEventModel[] = [
  {
    event: SubscriptionEvent.GlobalFileUpdated,
    labelKey: 'settings.notifications.notificationPreferences.items.files',
  },
  {
    event: SubscriptionEvent.GlobalReviews,
    labelKey: 'settings.notifications.notificationPreferences.items.preprints',
  },
];
