import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { SubscriptionFrequency } from '@osf/shared/enums';
import { NotificationSubscriptionMapper } from '@osf/shared/mappers';
import {
  JsonApiResponse,
  NotificationSubscription,
  NotificationSubscriptionGetResponseJsonApi,
} from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationSubscriptionService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly baseUrl = `${environment.apiDomainUrl}/v2/subscriptions/`;

  getAllGlobalNotificationSubscriptions(): Observable<NotificationSubscription[]> {
    const params: Record<string, string> = {
      'filter[event_name]': 'global_reviews,global_comments,global_comment_replies,global_file_updated,global_mentions',
    };

    return this.jsonApiService
      .get<JsonApiResponse<NotificationSubscriptionGetResponseJsonApi[], null>>(this.baseUrl, params)
      .pipe(
        map((responses) => responses.data.map((response) => NotificationSubscriptionMapper.fromGetResponse(response)))
      );
  }

  updateSubscription(id: string, frequency: SubscriptionFrequency): Observable<NotificationSubscription> {
    const request = NotificationSubscriptionMapper.toUpdateRequest(id, frequency);

    return this.jsonApiService
      .patch<NotificationSubscriptionGetResponseJsonApi>(`${this.baseUrl}${id}/`, request)
      .pipe(map((response) => NotificationSubscriptionMapper.fromGetResponse(response)));
  }
}
