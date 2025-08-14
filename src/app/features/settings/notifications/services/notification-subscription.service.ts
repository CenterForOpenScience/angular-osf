import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';
import { SubscriptionFrequency } from '@shared/enums';

import { NotificationSubscriptionMapper } from '../mappers';
import { NotificationSubscription, NotificationSubscriptionGetResponseJsonApi } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationSubscriptionService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly baseUrl = `${environment.apiUrl}/subscriptions/`;

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
      .get<JsonApiResponse<NotificationSubscriptionGetResponseJsonApi[], null>>(this.baseUrl, params)
      .pipe(
        map((responses) => responses.data.map((response) => NotificationSubscriptionMapper.fromGetResponse(response)))
      );
  }

  updateSubscription(
    id: string,
    frequency: SubscriptionFrequency,
    isNodeSubscription?: boolean
  ): Observable<NotificationSubscription> {
    const request = NotificationSubscriptionMapper.toUpdateRequest(id, frequency, isNodeSubscription);

    return this.jsonApiService
      .patch<NotificationSubscriptionGetResponseJsonApi>(`${this.baseUrl}/${id}/`, request)
      .pipe(map((response) => NotificationSubscriptionMapper.fromGetResponse(response)));
  }
}
