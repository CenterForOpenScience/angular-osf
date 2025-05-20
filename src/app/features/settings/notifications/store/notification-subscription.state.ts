import { Action, State, StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { NotificationSubscription } from '@osf/features/settings/notifications/models';
import { NotificationSubscriptionService } from '@osf/features/settings/notifications/services';
import {
  GetAllGlobalNotificationSubscriptions,
  UpdateNotificationSubscription,
} from '@osf/features/settings/notifications/store/notification-subscription.actions';
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

  @Action(UpdateNotificationSubscription)
  updateNotificationSubscription(
    ctx: StateContext<NotificationSubscriptionStateModel>,
    action: UpdateNotificationSubscription
  ) {
    return this.#notificationSubscriptionService.updateSubscription(action.payload.id, action.payload.frequency).pipe(
      tap((updatedSubscription) => {
        ctx.setState(
          patch({
            notificationSubscriptions: updateItem<NotificationSubscription>(
              (app) => app.id === action.payload.id,
              updatedSubscription
            ),
          })
        );
      })
    );
  }
}
