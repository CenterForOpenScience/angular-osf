import { Action, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { NotificationSubscriptionService } from '@osf/features/settings/notifications/service';
import { GetAllGlobalNotificationSubscriptions } from '@osf/features/settings/notifications/store/notification-subscription.actions';
import { NotificationSubscriptionStateModel } from '@osf/features/settings/notifications/store/notification-subscription.state-model';

@State<NotificationSubscriptionStateModel>({
  name: 'notificationSubscriptions',
  defaults: {
    notificationSubscriptions: [],
  },
})
@Injectable()
export class NotificationSubscriptionState {
  #notificationSubscriptionService = inject(NotificationSubscriptionService);

  @Action(GetAllGlobalNotificationSubscriptions)
  getAllGlobalNotificationSubscriptions(ctx: StateContext<NotificationSubscriptionStateModel>) {
    return this.#notificationSubscriptionService.getAllGlobalNotificationSubscriptions().pipe(
      tap((notificationSubscriptions) => {
        ctx.setState(patch({ notificationSubscriptions }));
      })
    );
  }
}
