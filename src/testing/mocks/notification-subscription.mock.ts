import { SubscriptionEvent } from '@osf/shared/enums/subscriptions/subscription-event.enum';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';
import { NotificationSubscription } from '@shared/models/notifications/notification-subscription.model';

export const MOCK_NOTIFICATION_SUBSCRIPTIONS: NotificationSubscription[] = [
  {
    id: 'mock-notification-1',
    event: SubscriptionEvent.FileUpdated,
    frequency: SubscriptionFrequency.Instant,
  },
  {
    id: 'mock-notification-2',
    event: SubscriptionEvent.GlobalFileUpdated,
    frequency: SubscriptionFrequency.Daily,
  },
  {
    id: 'mock-notification-4',
    event: SubscriptionEvent.GlobalReviews,
    frequency: SubscriptionFrequency.Instant,
  },
];
