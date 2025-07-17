import { SubscriptionEvent, SubscriptionFrequency } from '@shared/enums';

export interface NotificationSubscription {
  id: string;
  event: SubscriptionEvent;
  frequency: SubscriptionFrequency;
}
