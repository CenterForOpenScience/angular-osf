import { Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services/json-api/json-api.service';
import { NotificationSubscription } from '@osf/features/settings/notifications/models';

@Injectable({
  providedIn: 'root',
})
export class NotificationSubscriptionService {
  jsonApiService = inject(JsonApiService);
  baseUrl = 'https://api.staging4.osf.io/v2/subscriptions/';

  getAllGlobalNotificationSubscriptions(): Observable<NotificationSubscription[]> {
    //[RN] TODO: add mapper add filter params
    return this.jsonApiService.get<NotificationSubscription[]>(this.baseUrl);
  }
}
