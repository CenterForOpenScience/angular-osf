import { SubscriptionEvent, SubscriptionFrequency, SubscriptionType } from '../enums';
import {
  NotificationSubscription,
  NotificationSubscriptionGetResponseJsonApi,
  NotificationSubscriptionUpdateRequestJsonApi,
} from '../models';

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
