import { SubscriptionEvent } from '../enums/subscriptions/subscription-event.enum';
import { SubscriptionFrequency } from '../enums/subscriptions/subscription-frequency.enum';
import { SubscriptionType } from '../enums/subscriptions/subscription-type.enum';
import { NotificationSubscription } from '../models/notifications/notification-subscription.model';
import {
  NotificationSubscriptionGetResponseJsonApi,
  NotificationSubscriptionUpdateRequestJsonApi,
} from '../models/notifications/notification-subscription-json-api.model';

export class NotificationSubscriptionMapper {
  static fromGetResponse(response: NotificationSubscriptionGetResponseJsonApi): NotificationSubscription {
    return {
      id: response.id,
      event: response.attributes.event_name as SubscriptionEvent,
      frequency: response.attributes.frequency as SubscriptionFrequency,
    };
  }

  static toUpdateRequest(
    id: string,
    frequency: SubscriptionFrequency,
    isNodeSubscription?: boolean
  ): NotificationSubscriptionUpdateRequestJsonApi {
    const baseAttributes = {
      frequency: frequency,
    };

    return {
      data: {
        type: SubscriptionType.Global,
        attributes: baseAttributes,
        ...(isNodeSubscription ? {} : { id }),
      },
    };
  }
}
