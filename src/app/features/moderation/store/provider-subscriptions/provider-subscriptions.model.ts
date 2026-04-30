import { NotificationSubscription } from '@osf/shared/models/notifications/notification-subscription.model';
import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';

export interface ProviderSubscriptionsStateModel {
  subscriptions: AsyncStateModel<NotificationSubscription[]>;
}

export const PROVIDER_SUBSCRIPTIONS_STATE_DEFAULTS: ProviderSubscriptionsStateModel = {
  subscriptions: {
    data: [],
    isLoading: false,
    error: '',
  },
};
