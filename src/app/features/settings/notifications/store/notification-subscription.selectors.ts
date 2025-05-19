import { Selector } from '@ngxs/store';

import { DeveloperAppsState } from '@osf/features/settings/developer-apps/store/developer-apps.state';
import { NotificationSubscription } from '@osf/features/settings/notifications/models';
import { NotificationSubscriptionStateModel } from '@osf/features/settings/notifications/store/notification-subscription.state-model';

export class NotificationSubscriptionSelectors {
  @Selector([DeveloperAppsState])
  static getAllGlobalNotificationSubscriptions(state: NotificationSubscriptionStateModel): NotificationSubscription[] {
    return state.notificationSubscriptions;
  }
}
