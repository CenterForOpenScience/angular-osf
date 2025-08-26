import { Action, State, StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers';
import { NotificationSubscription } from '@osf/shared/models';

import { NotificationSubscriptionService } from '../services';

import {
  GetAllGlobalNotificationSubscriptions,
  UpdateNotificationSubscription,
} from './notification-subscription.actions';
import {
  NOTIFICATION_SUBSCRIPTION_STATE_DEFAULTS,
  NotificationSubscriptionStateModel,
} from './notification-subscription.model';

@State<NotificationSubscriptionStateModel>({
  name: 'notificationSubscriptions',
  defaults: NOTIFICATION_SUBSCRIPTION_STATE_DEFAULTS,
})
@Injectable()
export class NotificationSubscriptionState {
  private readonly notificationSubscriptionService = inject(NotificationSubscriptionService);

  @Action(GetAllGlobalNotificationSubscriptions)
  getAllGlobalNotificationSubscriptions(ctx: StateContext<NotificationSubscriptionStateModel>) {
    ctx.setState(patch({ notificationSubscriptions: patch({ isLoading: true }) }));

    return this.notificationSubscriptionService.getAllGlobalNotificationSubscriptions().pipe(
      tap((notificationSubscriptions) => {
        ctx.setState(
          patch({
            notificationSubscriptions: patch({
              data: notificationSubscriptions,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'notificationSubscriptions', error))
    );
  }

  @Action(UpdateNotificationSubscription)
  updateNotificationSubscription(
    ctx: StateContext<NotificationSubscriptionStateModel>,
    action: UpdateNotificationSubscription
  ) {
    return this.notificationSubscriptionService.updateSubscription(action.payload.id, action.payload.frequency).pipe(
      tap((updatedSubscription) => {
        ctx.setState(
          patch({
            notificationSubscriptions: patch({
              data: updateItem<NotificationSubscription>((app) => app.id === action.payload.id, updatedSubscription),
              error: null,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'notificationSubscriptions', error))
    );
  }
}
