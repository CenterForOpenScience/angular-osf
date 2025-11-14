import { SubscriptionEvent } from '@osf/shared/enums/subscriptions/subscription-event.enum';

import { SubscriptionEventModel } from '../models';

export const SUBSCRIPTION_EVENTS: SubscriptionEventModel[] = [
  {
    event: SubscriptionEvent.GlobalFileUpdated,
    labelKey: 'settings.notifications.notificationPreferences.items.files',
  },
  {
    event: SubscriptionEvent.GlobalReviews,
    labelKey: 'settings.notifications.notificationPreferences.items.preprints',
  },
];

export const FORM_EVENT_TO_API_EVENT: Record<string, string> = {
  new_pending_submissions: 'new_pending_submissions',
  files_updated: 'files_updated',
  global_file_updated: 'global_file_updated',
};

export const API_EVENT_TO_FORM_EVENT: Record<string, string> = {
  new_pending_submissions: 'new_pending_submissions',
  files_updated: 'global_file_updated',
};
