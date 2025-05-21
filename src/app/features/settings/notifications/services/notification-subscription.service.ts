import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@core/services/json-api/json-api.entity';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { SubscriptionFrequency } from '@osf/features/settings/notifications/enums';
import { NotificationSubscriptionMapper } from '@osf/features/settings/notifications/mappers';
import {
  NotificationSubscription,
  NotificationSubscriptionGetResponse,
} from '@osf/features/settings/notifications/models';

@Injectable({
  providedIn: 'root',
})
export class NotificationSubscriptionService {
  jsonApiService = inject(JsonApiService);
  baseUrl = 'https://api.staging4.osf.io/v2/subscriptions/';

  getAllGlobalNotificationSubscriptions(): Observable<NotificationSubscription[]> {
    const params: Record<string, string> = {
      'filter[event_name]': 'global_reviews,global_comments,global_comment_replies,global_file_updated,global_mentions',
    };

    return this.jsonApiService
      .get<JsonApiResponse<NotificationSubscriptionGetResponse[], null>>(this.baseUrl, params)
      .pipe(
        map((responses) => {
          return responses.data.map((response) => NotificationSubscriptionMapper.fromGetResponse(response));
        })
      );
  }

  updateSubscription(id: string, frequency: SubscriptionFrequency): Observable<NotificationSubscription> {
    const request = NotificationSubscriptionMapper.toUpdateRequest(id, frequency);

    return this.jsonApiService
      .patch<NotificationSubscriptionGetResponse>(this.baseUrl + id + '/', request)
      .pipe(map((response) => NotificationSubscriptionMapper.fromGetResponse(response)));
  }
}
