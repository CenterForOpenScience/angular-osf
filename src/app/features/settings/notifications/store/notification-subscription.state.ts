import { Action, State, StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';

import { tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { NotificationSubscription } from '../models';
import { NotificationSubscriptionService } from '../services';

import {
  GetAllGlobalNotificationSubscriptions,
  GetNotificationSubscriptionsByNodeId,
  UpdateNotificationSubscription,
  UpdateNotificationSubscriptionForNodeId,
} from './notification-subscription.actions';
import { NotificationSubscriptionModel } from './notification-subscription.model';

@State<NotificationSubscriptionModel>({
  name: 'notificationSubscriptions',
  defaults: {
    notificationSubscriptions: {
      data: [],
      isLoading: false,
      error: '',
    },
    notificationSubscriptionsByNodeId: {
      data: [],
      isLoading: false,
      error: '',
    },
  },
})
@Injectable()
export class NotificationSubscriptionState {
  #notificationSubscriptionService = inject(NotificationSubscriptionService);

  @Action(GetAllGlobalNotificationSubscriptions)
  getAllGlobalNotificationSubscriptions(ctx: StateContext<NotificationSubscriptionModel>) {
    ctx.setState(patch({ notificationSubscriptions: patch({ isLoading: true }) }));

    return this.#notificationSubscriptionService.getAllGlobalNotificationSubscriptions().pipe(
      tap((notificationSubscriptions) => {
        ctx.setState(
          patch({
            notificationSubscriptions: patch({
              data: notificationSubscriptions,
              isLoading: false,
            }),
          })
        );
      })
    );
  }

  @Action(GetNotificationSubscriptionsByNodeId)
  getNotificationSubscriptionsByNodeId(
    ctx: StateContext<NotificationSubscriptionModel>,
    action: GetNotificationSubscriptionsByNodeId
  ) {
    return this.#notificationSubscriptionService.getAllGlobalNotificationSubscriptions(action.nodeId).pipe(
      tap((notificationSubscriptions) => {
        ctx.setState(
          patch({
            notificationSubscriptionsByNodeId: patch({
              data: notificationSubscriptions,
              isLoading: false,
            }),
          })
        );
      })
    );
  }

  @Action(UpdateNotificationSubscription)
  updateNotificationSubscription(
    ctx: StateContext<NotificationSubscriptionModel>,
    action: UpdateNotificationSubscription
  ) {
    return this.#notificationSubscriptionService.updateSubscription(action.payload.id, action.payload.frequency).pipe(
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
      })
    );
  }

  @Action(UpdateNotificationSubscriptionForNodeId)
  updateNotificationSubscriptionForNodeId(
    ctx: StateContext<NotificationSubscriptionModel>,
    action: UpdateNotificationSubscription
  ) {
    return this.#notificationSubscriptionService
      .updateSubscription(action.payload.id, action.payload.frequency, true)
      .pipe(
        tap((updatedSubscription) => {
          ctx.setState(
            patch({
              notificationSubscriptionsByNodeId: patch({
                data: updateItem<NotificationSubscription>((app) => app.id === action.payload.id, updatedSubscription),
                error: null,
                isLoading: false,
              }),
            })
          );
        })
      );
  }
}
