import { Selector } from '@ngxs/store';

import { NotificationSubscription } from '../models';

import { NotificationSubscriptionModel } from './notification-subscription.model';
import { NotificationSubscriptionState } from './notification-subscription.state';

export class NotificationSubscriptionSelectors {
  @Selector([NotificationSubscriptionState])
  static getAllGlobalNotificationSubscriptions(state: NotificationSubscriptionModel): NotificationSubscription[] {
    return state.notificationSubscriptions.data;
  }

  @Selector([NotificationSubscriptionState])
  static isLoading(state: NotificationSubscriptionModel): boolean {
    return state.notificationSubscriptions.isLoading;
  }
}
