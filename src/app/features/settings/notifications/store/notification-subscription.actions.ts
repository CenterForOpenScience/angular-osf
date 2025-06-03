import { SubscriptionFrequency } from '@shared/enums';

export class GetAllGlobalNotificationSubscriptions {
  static readonly type = '[Notification Subscriptions] Get All Global';
}

export class GetNotificationSubscriptionsByNodeId {
  static readonly type = '[Notification Subscriptions] Get By Node Id';

  constructor(public nodeId: string) {}
}

export class UpdateNotificationSubscription {
  static readonly type = '[Notification Subscriptions] Update';

  constructor(public payload: { id: string; frequency: SubscriptionFrequency }) {}
}

export class UpdateNotificationSubscriptionForNodeId {
  static readonly type = '[Notification Subscriptions] Update For Node';

  constructor(public payload: { id: string; frequency: SubscriptionFrequency }) {}
}
