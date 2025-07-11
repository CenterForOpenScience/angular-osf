import { SubscriptionEvent } from '@osf/shared/enums';

export interface SubscriptionEventModel {
  event: SubscriptionEvent;
  labelKey: string;
}
