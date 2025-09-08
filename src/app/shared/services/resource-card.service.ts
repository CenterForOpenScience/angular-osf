import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { MapUserCounts } from '@shared/mappers';
import { UserRelatedCounts, UserRelatedCountsResponseJsonApi } from '@shared/models';
import { JsonApiService } from '@shared/services';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResourceCardService {
  private jsonApiService = inject(JsonApiService);
  private apiUrl = `${environment.apiDomainUrl}/v2`;

  getUserRelatedCounts(userId: string): Observable<UserRelatedCounts> {
    const params: Record<string, string> = {
      related_counts: 'nodes,registrations,preprints',
    };

    return this.jsonApiService
      .get<UserRelatedCountsResponseJsonApi>(`${this.apiUrl}/users/${userId}/`, params)
      .pipe(map((response) => MapUserCounts(response)));
  }
}
