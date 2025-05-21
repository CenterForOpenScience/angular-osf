import { Selector } from '@ngxs/store';

import { NotificationSubscription } from '@osf/features/settings/notifications/models';
import {
  NotificationSubscriptionModel,
  NotificationSubscriptionState,
} from '@osf/features/settings/notifications/store';

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
