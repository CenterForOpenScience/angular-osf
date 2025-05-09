import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services/json-api/json-api.service';
import { MapUserCounts } from '@shared/components/resources/resource-card/mappers/user-counts.mapper';
import { UserCountsResponse } from '@shared/components/resources/resource-card/models/user-counts-response.entity';
import { UserRelatedDataCounts } from '@shared/components/resources/resource-card/models/user-related-data-counts.entity';

import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResourceCardService {
  #jsonApiService = inject(JsonApiService);

  getUserRelatedCounts(userIri: string): Observable<UserRelatedDataCounts> {
    const params: Record<string, string> = {
      related_counts: 'nodes,registrations,preprints',
    };

    return this.#jsonApiService
      .get<UserCountsResponse>(`${environment.apiUrl}/users/${userIri}`, params)
      .pipe(map((response) => MapUserCounts(response)));
  }
}
