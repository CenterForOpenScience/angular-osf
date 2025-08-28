import { AsyncStateModel, NotificationSubscription } from '@osf/shared/models';

export interface NotificationSubscriptionStateModel {
  notificationSubscriptions: AsyncStateModel<NotificationSubscription[]>;
}

export const NOTIFICATION_SUBSCRIPTION_STATE_DEFAULTS: NotificationSubscriptionStateModel = {
  notificationSubscriptions: {
    data: [],
    isLoading: false,
    error: '',
  },
};
