import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';
import { MapUserCounts } from '@osf/shared/mappers';
import { UserCountsResponse, UserRelatedDataCounts } from '@osf/shared/models';

import { environment } from 'src/environments/environment';

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
