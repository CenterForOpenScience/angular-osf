import { SubscriptionEvent } from '@osf/shared/enums/subscriptions/subscription-event.enum';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';

export interface NotificationSubscription {
  id: string;
  event: SubscriptionEvent;
  frequency: SubscriptionFrequency;
}
