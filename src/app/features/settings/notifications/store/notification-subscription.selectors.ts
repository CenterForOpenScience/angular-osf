import { Selector } from '@ngxs/store';

import { NotificationSubscription } from '@osf/shared/models';

import { NotificationSubscriptionStateModel } from './notification-subscription.model';
import { NotificationSubscriptionState } from './notification-subscription.state';

export class NotificationSubscriptionSelectors {
  @Selector([NotificationSubscriptionState])
  static getAllGlobalNotificationSubscriptions(state: NotificationSubscriptionStateModel): NotificationSubscription[] {
    return state.notificationSubscriptions.data;
  }

  @Selector([NotificationSubscriptionState])
  static isLoading(state: NotificationSubscriptionStateModel): boolean {
    return state.notificationSubscriptions.isLoading;
  }
}
