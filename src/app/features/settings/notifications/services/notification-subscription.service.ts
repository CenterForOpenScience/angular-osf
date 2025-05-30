import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';
import { SubscriptionFrequency } from '@shared/enums';

import { NotificationSubscriptionMapper } from '../mappers';
import { NotificationSubscription, NotificationSubscriptionGetResponse } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationSubscriptionService {
  jsonApiService = inject(JsonApiService);
  baseUrl = `${environment.apiUrl}/subscriptions/`;

  getAllGlobalNotificationSubscriptions(nodeId?: string): Observable<NotificationSubscription[]> {
    let params: Record<string, string>;
    if (nodeId) {
      params = {
        'filter[id]': `${nodeId}_file_updated,${nodeId}_comments`,
      };
    } else {
      params = {
        'filter[event_name]':
          'global_reviews,global_comments,global_comment_replies,global_file_updated,global_mentions',
      };
    }

    return this.jsonApiService
      .get<JsonApiResponse<NotificationSubscriptionGetResponse[], null>>(this.baseUrl, params)
      .pipe(
        map((responses) => {
          return responses.data.map((response) => NotificationSubscriptionMapper.fromGetResponse(response));
        })
      );
  }

  updateSubscription(
    id: string,
    frequency: SubscriptionFrequency,
    isNodeSubscription?: boolean
  ): Observable<NotificationSubscription> {
    const request = NotificationSubscriptionMapper.toUpdateRequest(id, frequency, isNodeSubscription);

    return this.jsonApiService
      .patch<NotificationSubscriptionGetResponse>(this.baseUrl + id + '/', request)
      .pipe(map((response) => NotificationSubscriptionMapper.fromGetResponse(response)));
  }
}
