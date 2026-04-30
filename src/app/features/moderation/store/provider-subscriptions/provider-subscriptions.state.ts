import { Action, State, StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';

import { catchError, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { handleSectionError } from '@osf/shared/helpers/state-error.handler';
import { NotificationSubscription } from '@osf/shared/models/notifications/notification-subscription.model';

import { ProviderSubscriptionService } from '../../services';

import { GetProviderSubscriptions, UpdateProviderSubscription } from './provider-subscriptions.actions';
import { PROVIDER_SUBSCRIPTIONS_STATE_DEFAULTS, ProviderSubscriptionsStateModel } from './provider-subscriptions.model';

@State<ProviderSubscriptionsStateModel>({
  name: 'providerSubscriptions',
  defaults: PROVIDER_SUBSCRIPTIONS_STATE_DEFAULTS,
})
@Injectable()
export class ProviderSubscriptionsState {
  private readonly providerSubscriptionService = inject(ProviderSubscriptionService);

  @Action(GetProviderSubscriptions)
  getProviderSubscriptions(ctx: StateContext<ProviderSubscriptionsStateModel>, action: GetProviderSubscriptions) {
    ctx.setState(patch({ subscriptions: patch({ isLoading: true }) }));

    return this.providerSubscriptionService.getProviderSubscriptions(action.providerType, action.providerId).pipe(
      tap((subscriptions) => {
        ctx.setState(
          patch({
            subscriptions: patch({
              data: subscriptions,
              isLoading: false,
            }),
          })
        );
      }),
      catchError((error) => handleSectionError(ctx, 'subscriptions', error))
    );
  }

  @Action(UpdateProviderSubscription)
  updateProviderSubscription(ctx: StateContext<ProviderSubscriptionsStateModel>, action: UpdateProviderSubscription) {
    return this.providerSubscriptionService
      .updateProviderSubscription(
        action.payload.providerType,
        action.payload.providerId,
        action.payload.subscriptionId,
        action.payload.frequency
      )
      .pipe(
        tap((updatedSubscription) => {
          ctx.setState(
            patch({
              subscriptions: patch({
                data: updateItem<NotificationSubscription>(
                  (sub) => sub.id === action.payload.subscriptionId,
                  updatedSubscription
                ),
                error: null,
                isLoading: false,
              }),
            })
          );
        }),
        catchError((error) => handleSectionError(ctx, 'subscriptions', error))
      );
  }
}
