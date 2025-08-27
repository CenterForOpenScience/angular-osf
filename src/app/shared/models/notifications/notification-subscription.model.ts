import { SubscriptionEvent, SubscriptionFrequency } from '@osf/shared/enums';

export interface NotificationSubscription {
  id: string;
  event: SubscriptionEvent;
  frequency: SubscriptionFrequency;
}
