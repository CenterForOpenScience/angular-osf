import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@osf/core/services/json-api/json-api.entity';
import { JsonApiService } from '@osf/core/services/json-api/json-api.service';

import { AnalyticsMetricsMapper, RelatedCountsMapper } from '../mappers';
import { AnalyticsMetricsGetResponse, AnalyticsMetricsModel, RelatedCountsGetResponse } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  #baseUrl = 'https://api.staging4.osf.io/_/metrics/query/node_analytics';

  #jsonApiService = inject(JsonApiService);

  getMetrics(projectId: string, dateRange: string): Observable<AnalyticsMetricsModel> {
    return this.#jsonApiService
      .get<JsonApiResponse<AnalyticsMetricsGetResponse, null>>(`${this.#baseUrl}/${projectId}/${dateRange}`)
      .pipe(map((response) => AnalyticsMetricsMapper.fromResponse(response.data)));
  }

  getRelatedCounts(projectId: string) {
    const url = `${environment.apiUrl}/nodes/${projectId}/?related_counts=true`;

    return this.#jsonApiService
      .get<RelatedCountsGetResponse>(url)
      .pipe(map((response) => RelatedCountsMapper.fromResponse(response)));
  }
}
