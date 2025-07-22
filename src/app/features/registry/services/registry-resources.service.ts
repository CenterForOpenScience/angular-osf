import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { MapRegistryResource } from '@osf/features/registry/mappers';
import { GetRegistryResourcesJsonApi, RegistryResource } from '@osf/features/registry/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistryResourcesService {
  private jsonApiService = inject(JsonApiService);

  getResources(registryId: string): Observable<RegistryResource[]> {
    return this.jsonApiService
      .get<GetRegistryResourcesJsonApi>(`${environment.apiUrl}/registrations/${registryId}/resources/?page=1`)
      .pipe(map((response) => response.data.map((resource) => MapRegistryResource(resource))));
  }
}
