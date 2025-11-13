import { Pipe, PipeTransform } from '@angular/core';

import { SubscriptionEvent } from '@osf/shared/enums/subscriptions/subscription-event.enum';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';

@Pipe({
  name: 'notificationDescription',
})
export class NotificationDescriptionPipe implements PipeTransform {
  transform(event: SubscriptionEvent, frequency?: SubscriptionFrequency): string {
    if (!event || !frequency) return '';

    return `myProjects.settings.descriptions.${event}.${frequency}`;
  }
}
