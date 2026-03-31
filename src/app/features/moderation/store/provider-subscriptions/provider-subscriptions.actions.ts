import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';

export class GetProviderSubscriptions {
  static readonly type = '[Provider Subscriptions] Get';

  constructor(
    public providerType: string,
    public providerId: string
  ) {}
}

export class UpdateProviderSubscription {
  static readonly type = '[Provider Subscriptions] Update';

  constructor(
    public payload: {
      providerType: string;
      providerId: string;
      subscriptionId: string;
      frequency: SubscriptionFrequency;
    }
  ) {}
}
