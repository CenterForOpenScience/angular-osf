import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';
import { NotificationSubscriptionMapper } from '@osf/shared/mappers/notification-subscription.mapper';
import { JsonApiResponse } from '@osf/shared/models/common/json-api.model';
import { NotificationSubscription } from '@osf/shared/models/notifications/notification-subscription.model';
import { NotificationSubscriptionGetResponseJsonApi } from '@osf/shared/models/notifications/notification-subscription-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationSubscriptionService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2/subscriptions/`;
  }

  getAllGlobalNotificationSubscriptions(): Observable<NotificationSubscription[]> {
    const params: Record<string, string> = {
      'filter[event_name]': 'global_reviews,global_file_updated',
    };

    return this.jsonApiService
      .get<JsonApiResponse<NotificationSubscriptionGetResponseJsonApi[], null>>(this.apiUrl, params)
      .pipe(
        map((responses) => responses.data.map((response) => NotificationSubscriptionMapper.fromGetResponse(response)))
      );
  }

  updateSubscription(id: string, frequency: SubscriptionFrequency): Observable<NotificationSubscription> {
    const request = NotificationSubscriptionMapper.toUpdateRequest(id, frequency);

    return this.jsonApiService
      .patch<NotificationSubscriptionGetResponseJsonApi>(`${this.apiUrl}${id}/`, request)
      .pipe(map((response) => NotificationSubscriptionMapper.fromGetResponse(response)));
  }
}
