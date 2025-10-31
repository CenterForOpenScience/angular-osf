import { Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { CurrentResource } from '@osf/shared/models/current-resource.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiDomainUrl() {
    return `${this.environment.apiDomainUrl}/_/metrics/events/counted_usage/`;
  }

  getPageviewPayload(resource: CurrentResource, routeName: string) {
    // TODO: maybe it is worth to add additional attributes like it is for ember (not confident how to obtain it using Angular)
    const all_attrs = { item_guid: resource?.id } as const;
    const attributes = Object.fromEntries(
      Object.entries(all_attrs).filter(([_, value]: [unknown, unknown]) => typeof value !== 'undefined')
    );
    // if we tap one by one through different tabs using Details menu document.title is set as expected
    // but when we open it in new tab it is 'OSF' and will be set only after page is loaded
    const pageTitle = document.title === 'OSF' ? `OSF | ${resource.title}` : document.title;
    return {
      data: {
        type: 'counted-usage',
        attributes: {
          ...attributes,
          action_labels: ['web', 'view'],
          pageview_info: {
            page_url: document.URL,
            page_title: pageTitle,
            referer_url: document.referrer,
            route_name: `angular-osf-web.${routeName}`,
          },
        },
      },
    };
  }

  sendCountedUsage(resource: CurrentResource, route: string): Observable<void> {
    const payload = this.getPageviewPayload(resource, route);
    return this.jsonApiService.post<void>(this.apiDomainUrl, payload);
  }
}
