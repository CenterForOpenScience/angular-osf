import { SubscriptionEvent } from '@osf/shared/enums/subscriptions/subscription-event.enum';

export interface SubscriptionEventModel {
  event: SubscriptionEvent;
  labelKey: string;
}
