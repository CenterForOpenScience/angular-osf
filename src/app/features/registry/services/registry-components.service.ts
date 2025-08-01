import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';

import { RegistryComponentsMapper } from '../mappers';
import { RegistryComponentsJsonApiResponse, RegistryComponentsResponseJsonApi } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistryComponentsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly apiUrl = environment.apiUrl;

  getRegistryComponents(registryId: string, page = 1, pageSize = 10): Observable<RegistryComponentsResponseJsonApi> {
    const params: Record<string, unknown> = {
      page: page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<RegistryComponentsJsonApiResponse>(`${this.apiUrl}/registrations/${registryId}/children/`, params)
      .pipe(
        map((response) => ({
          data: response.data.map(RegistryComponentsMapper.fromApiResponse),
          meta: response.meta,
        }))
      );
  }
}
