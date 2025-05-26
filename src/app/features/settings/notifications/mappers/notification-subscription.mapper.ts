import { SubscriptionEvent, SubscriptionFrequency } from '../enums';
import {
  NotificationSubscription,
  NotificationSubscriptionGetResponse,
  NotificationSubscriptionUpdateRequest,
} from '../models';

export class NotificationSubscriptionMapper {
  static fromGetResponse(response: NotificationSubscriptionGetResponse): NotificationSubscription {
    return {
      id: response.id,
      event: response.attributes.event_name as SubscriptionEvent,
      frequency: response.attributes.frequency as SubscriptionFrequency,
    };
  }

  static toUpdateRequest(id: string, frequency: SubscriptionFrequency): NotificationSubscriptionUpdateRequest {
    return {
      data: {
        id: id,
        attributes: {
          frequency: frequency,
        },
        type: 'subscription',
      },
    };
  }
}
