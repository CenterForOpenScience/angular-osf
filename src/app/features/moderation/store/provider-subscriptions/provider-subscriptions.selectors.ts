import { Selector } from '@ngxs/store';

import { NotificationSubscription } from '@osf/shared/models/notifications/notification-subscription.model';

import { ProviderSubscriptionsStateModel } from './provider-subscriptions.model';
import { ProviderSubscriptionsState } from './provider-subscriptions.state';

export class ProviderSubscriptionsSelectors {
  @Selector([ProviderSubscriptionsState])
  static getSubscriptions(state: ProviderSubscriptionsStateModel): NotificationSubscription[] {
    return state.subscriptions.data;
  }

  @Selector([ProviderSubscriptionsState])
  static isLoading(state: ProviderSubscriptionsStateModel): boolean {
    return state.subscriptions.isLoading;
  }
}
