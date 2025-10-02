import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly environment = inject(ENVIRONMENT);

  apiDomainUrl() {
    return `${this.environment.apiDomainUrl}/_/metrics/events/counted_usage/`;
  }

  async sendCountedUsage(guid: string, routeName: string): Promise<void> {
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

    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.api+json',
    });
    this.http.post(this.apiDomainUrl(), payload, { headers }).subscribe({
      next: () => console.log('Usage event sent', payload),
      error: (err) => console.error('Error sending usage event', err),
    });
  }
}
