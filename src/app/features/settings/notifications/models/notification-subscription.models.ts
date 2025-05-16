import { SubscriptionEvent, SubscriptionFrequency } from '@osf/features/settings/notifications/enums';

//domain models
export interface NotificationSubscription {
  event: SubscriptionEvent;
  frequency: SubscriptionFrequency;
}

//api models
interface NotificationSubscriptionGetResponse {
  id: string;
  type: 'subscription';
  attributes: {
    event_name: string;
    frequency: string;
  };
}
