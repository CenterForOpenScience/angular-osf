import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { SubscriptionFrequency } from '@osf/shared/enums/subscriptions/subscription-frequency.enum';
import { SubscriptionType } from '@osf/shared/enums/subscriptions/subscription-type.enum';
import { NotificationSubscriptionMapper } from '@osf/shared/mappers/notification-subscription.mapper';
import { JsonApiResponse } from '@osf/shared/models/common/json-api.model';
import { NotificationSubscription } from '@osf/shared/models/notifications/notification-subscription.model';
import { NotificationSubscriptionGetResponseJsonApi } from '@osf/shared/models/notifications/notification-subscription-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProviderSubscriptionService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  private providerUrl(providerType: string, providerId: string): string {
    return `${this.environment.apiDomainUrl}/v2/providers/${providerType}/${providerId}/subscriptions/`;
  }

  getProviderSubscriptions(providerType: string, providerId: string): Observable<NotificationSubscription[]> {
    return this.jsonApiService
      .get<
        JsonApiResponse<NotificationSubscriptionGetResponseJsonApi[], null>
      >(this.providerUrl(providerType, providerId))
      .pipe(
        map((responses) => responses.data.map((response) => NotificationSubscriptionMapper.fromGetResponse(response)))
      );
  }

  updateProviderSubscription(
    providerType: string,
    providerId: string,
    subscriptionId: string,
    frequency: SubscriptionFrequency
  ): Observable<NotificationSubscription> {
    const request = {
      data: {
        id: subscriptionId,
        type: SubscriptionType.Node,
        attributes: { frequency },
      },
    };

    return this.jsonApiService
      .patch<NotificationSubscriptionGetResponseJsonApi>(
        `${this.providerUrl(providerType, providerId)}${subscriptionId}/`,
        request
      )
      .pipe(map((response) => NotificationSubscriptionMapper.fromGetResponse(response)));
  }
}
