import { SubscriptionEvent, SubscriptionFrequency } from '../enums';

//domain models
export interface NotificationSubscription {
  id: string;
  event: SubscriptionEvent;
  frequency: SubscriptionFrequency;
}

//api models
export interface NotificationSubscriptionGetResponse {
  id: string;
  type: 'subscription';
  attributes: {
    event_name: string;
    frequency: string;
  };
}

export interface NotificationSubscriptionUpdateRequest {
  data: {
    id: string;
    type: 'subscription';
    attributes: {
      frequency: SubscriptionFrequency;
    };
  };
}
