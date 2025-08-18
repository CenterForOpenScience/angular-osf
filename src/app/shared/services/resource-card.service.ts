import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { MapUserCounts } from '@shared/mappers';
import { UserCountsResponse, UserRelatedDataCounts } from '@shared/models';
import { JsonApiService } from '@shared/services';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResourceCardService {
  private jsonApiService = inject(JsonApiService);

  getUserRelatedCounts(userIri: string): Observable<UserRelatedDataCounts> {
    const params: Record<string, string> = {
      related_counts: 'nodes,registrations,preprints',
    };

    return this.jsonApiService
      .get<UserCountsResponse>(`${environment.apiUrl}/users/${userIri}/`, params)
      .pipe(map((response) => MapUserCounts(response)));
  }
}
