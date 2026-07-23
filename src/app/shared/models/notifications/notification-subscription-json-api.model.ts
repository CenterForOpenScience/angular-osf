import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';

import { JsonApiResource } from '../common/json-api/resource.model';
import { ListResponse } from '../common/json-api/responses.model';

export type NotificationSubscriptionsListResponseJsonApi = ListResponse<NotificationSubscriptionDataJsonApi>;

export type NotificationSubscriptionDataJsonApi = JsonApiResource<
  NotificationSubscriptionTypeJsonApi,
  NotificationSubscriptionAttributesJsonApi
>;

export type NotificationSubscriptionGetResponseJsonApi = NotificationSubscriptionDataJsonApi;

export interface NotificationSubscriptionUpdateRequestJsonApi {
  data: NotificationSubscriptionUpdateDataJsonApi;
}

interface NotificationSubscriptionUpdateDataJsonApi extends Omit<
  JsonApiResource<NotificationSubscriptionTypeJsonApi, NotificationSubscriptionUpdateAttributesJsonApi>,
  'id'
> {
  id?: string;
}

type NotificationSubscriptionTypeJsonApi = 'subscription' | 'user-provider-subscription';

interface NotificationSubscriptionAttributesJsonApi {
  event_name: string;
  frequency: string;
}

interface NotificationSubscriptionUpdateAttributesJsonApi {
  frequency: SubscriptionFrequency;
}
