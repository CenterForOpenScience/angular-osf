import { SubscriptionEvent, SubscriptionFrequency } from '@shared/enums';

//domain models
export interface NotificationSubscription {
  id: string;
  event: SubscriptionEvent;
  frequency: SubscriptionFrequency;
}

//api models
export interface NotificationSubscriptionGetResponse {
  id: string;
  type: 'subscription' | 'user-provider-subscription';
  attributes: {
    event_name: string;
    frequency: string;
  };
}

export interface NotificationSubscriptionUpdateRequest {
  data: {
    id?: string;
    type: 'subscription' | 'user-provider-subscription';
    attributes: {
      frequency: SubscriptionFrequency;
    };
  };
}
