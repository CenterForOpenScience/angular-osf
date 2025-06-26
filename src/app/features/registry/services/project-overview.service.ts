import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { MapRegistryOverview } from '@osf/features/registry/mappers';
import { GetRegistryOverviewJsonApi, RegistryOverview } from '@osf/features/registry/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistryOverviewService {
  private jsonApiService = inject(JsonApiService);

  getRegistrationById(id: string): Observable<RegistryOverview> {
    const params = {
      related_counts: 'forks,comments,linked_nodes,linked_registrations,children,wikis',
      'embed[]': [
        'bibliographic_contributors',
        'provider',
        'registration_schema',
        'identifiers',
        'root',
        'schema_responses',
        'files',
      ],
    };

    return this.jsonApiService
      .get<GetRegistryOverviewJsonApi>(`${environment.apiUrl}/registrations/${id}`, params)
      .pipe(map((response) => MapRegistryOverview(response.data)));
  }
}
