import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';
import { ResourceType } from '@osf/shared/enums';

import { AnalyticsMetricsMapper, RelatedCountsMapper } from '../mappers';
import { AnalyticsMetricsGetResponse, AnalyticsMetricsModel, RelatedCountsGetResponse } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private readonly jsonApiService = inject(JsonApiService);

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
  ]);

  getMetrics(resourceId: string, dateRange: string): Observable<AnalyticsMetricsModel> {
    const baseUrl = `${environment.apiDomainUrl}/_/metrics/query/node_analytics`;

    return this.jsonApiService
      .get<JsonApiResponse<AnalyticsMetricsGetResponse, null>>(`${baseUrl}/${resourceId}/${dateRange}`)
      .pipe(map((response) => AnalyticsMetricsMapper.fromResponse(response.data)));
  }

  getRelatedCounts(resourceId: string, resourceType: ResourceType) {
    const resourcePath = this.urlMap.get(resourceType);
    const url = `${environment.apiUrl}/${resourcePath}/${resourceId}/?related_counts=true`;

    return this.jsonApiService
      .get<RelatedCountsGetResponse>(url)
      .pipe(map((response) => RelatedCountsMapper.fromResponse(response)));
  }
}
