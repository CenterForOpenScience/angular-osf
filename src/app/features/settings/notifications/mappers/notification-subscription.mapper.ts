import { SubscriptionEvent, SubscriptionFrequency, SubscriptionType } from '@shared/enums';

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

  static toUpdateRequest(
    id: string,
    frequency: SubscriptionFrequency,
    isNodeSubscription?: boolean
  ): NotificationSubscriptionUpdateRequest {
    const baseAttributes = {
      frequency: frequency,
    };

    return {
      data: {
        type: isNodeSubscription ? SubscriptionType.Node : SubscriptionType.Global,
        attributes: baseAttributes,
        ...(isNodeSubscription ? {} : { id }),
      },
    };
  }
}
