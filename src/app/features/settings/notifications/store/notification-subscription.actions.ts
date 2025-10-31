import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';

export class GetAllGlobalNotificationSubscriptions {
  static readonly type = '[Notification Subscriptions] Get All Global';
}

export class UpdateNotificationSubscription {
  static readonly type = '[Notification Subscriptions] Update';

  constructor(public payload: { id: string; frequency: SubscriptionFrequency }) {}
}
