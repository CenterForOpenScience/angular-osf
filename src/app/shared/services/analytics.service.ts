import { Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { JsonApiService } from '@osf/shared/services';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiDomainUrl() {
    return `${this.environment.apiDomainUrl}/_/metrics/events/counted_usage/`;
  }

  sendCountedUsage(guid: string, routeName: string): Observable<void> {
    const payload = {
      data: {
        type: 'counted-usage',
        attributes: {
          item_guid: guid,
          action_labels: ['web', 'view'],
          pageview_info: {
            page_url: document.URL,
            page_title: document.title,
            referer_url: document.referrer,
            route_name: `angular-osf-web.${routeName}`,
          },
        },
      },
    };

    return this.jsonApiService.post<void>(this.apiDomainUrl, payload);
  }
}
