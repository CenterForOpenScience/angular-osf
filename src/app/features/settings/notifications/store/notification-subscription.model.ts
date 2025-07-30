import { AsyncStateModel } from '@osf/shared/models';

import { NotificationSubscription } from '../models';

export interface NotificationSubscriptionStateModel {
  notificationSubscriptions: AsyncStateModel<NotificationSubscription[]>;
  notificationSubscriptionsByNodeId: AsyncStateModel<NotificationSubscription[]>;
}

export const NOTIFICATION_SUBSCRIPTION_STATE_DEFAULTS: NotificationSubscriptionStateModel = {
  notificationSubscriptions: {
    data: [],
    isLoading: false,
    error: '',
  },
  notificationSubscriptionsByNodeId: {
    data: [],
    isLoading: false,
    error: '',
  },
};
