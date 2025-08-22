import { Pipe, PipeTransform } from '@angular/core';

import { SubscriptionEvent, SubscriptionFrequency } from '@shared/enums';

@Pipe({
  name: 'notificationDescription',
})
export class NotificationDescriptionPipe implements PipeTransform {
  transform(event: SubscriptionEvent, frequency?: SubscriptionFrequency): string {
    if (!event || !frequency) return '';

    const key = `myProjects.settings.descriptions.${event}.${frequency}`;
    return key;
  }
}
