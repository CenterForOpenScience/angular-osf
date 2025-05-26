import { AsyncStateModel } from '@osf/shared/models';

import { NotificationSubscription } from '../models';

export interface NotificationSubscriptionModel {
  notificationSubscriptions: AsyncStateModel<NotificationSubscription[]>;
}
