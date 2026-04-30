import { SubscriptionFrequency } from '../enums/subscriptions/subscription-frequency.enum';

export const SUBSCRIPTION_FREQUENCY_OPTIONS = [
  { label: 'settings.notifications.frequency.never', value: SubscriptionFrequency.Never },
  { label: 'settings.notifications.frequency.daily', value: SubscriptionFrequency.Daily },
  { label: 'settings.notifications.frequency.instant', value: SubscriptionFrequency.Instant },
];
