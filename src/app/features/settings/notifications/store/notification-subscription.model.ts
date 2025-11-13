import { NotificationSubscription } from '@osf/shared/models/notifications/notification-subscription.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

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
