import { Selector } from '@ngxs/store';

import { NotificationSubscription } from '@osf/features/settings/notifications/models';
import { NotificationSubscriptionState } from '@osf/features/settings/notifications/store/notification-subscription.state';
import { NotificationSubscriptionStateModel } from '@osf/features/settings/notifications/store/notification-subscription.state-model';

export class NotificationSubscriptionSelectors {
  @Selector([NotificationSubscriptionState])
  static getAllGlobalNotificationSubscriptions(state: NotificationSubscriptionStateModel): NotificationSubscription[] {
    return state.notificationSubscriptions;
  }
}
