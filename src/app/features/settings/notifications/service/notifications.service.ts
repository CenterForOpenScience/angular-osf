import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services/json-api/json-api.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  jsonApiService = inject(JsonApiService);
  baseUrl = 'https://api.staging4.osf.io/v2/subscriptions/';
}
