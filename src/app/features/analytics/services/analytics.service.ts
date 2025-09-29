import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ResourceType } from '@osf/shared/enums';
import { JsonApiService } from '@osf/shared/services';

import { AnalyticsMetricsMapper, RelatedCountsMapper } from '../mappers';
import { NodeAnalyticsModel, NodeAnalyticsResponseJsonApi, RelatedCountsGetResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiDomainUrl() {
    return this.environment.apiDomainUrl;
  }

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
  ]);

  getMetrics(resourceId: string, dateRange: string): Observable<NodeAnalyticsModel> {
    const baseUrl = `${this.apiDomainUrl}/_/metrics/query/node_analytics`;

    return this.jsonApiService
      .get<NodeAnalyticsResponseJsonApi>(`${baseUrl}/${resourceId}/${dateRange}/`)
      .pipe(map((response) => AnalyticsMetricsMapper.fromResponse(response.data)));
  }

  getRelatedCounts(resourceId: string, resourceType: ResourceType) {
    const resourcePath = this.urlMap.get(resourceType);
    const url = `${this.apiDomainUrl}/v2/${resourcePath}/${resourceId}/?related_counts=true`;

    return this.jsonApiService
      .get<RelatedCountsGetResponse>(url)
      .pipe(map((response) => RelatedCountsMapper.fromResponse(response)));
  }
}
