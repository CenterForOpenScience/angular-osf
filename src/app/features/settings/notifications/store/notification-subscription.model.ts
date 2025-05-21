import { NotificationSubscription } from '@osf/features/settings/notifications/models';
import { AsyncStateModel } from '@shared/models/store';

export interface NotificationSubscriptionModel {
  notificationSubscriptions: AsyncStateModel<NotificationSubscription[]>;
}
