import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { JsonApiService } from '@osf/shared/services/json-api.service';

import { RegistryComponentsMapper } from '../mappers';
import { RegistryComponentsJsonApiResponse, RegistryComponentsResponseJsonApi } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RegistryComponentsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getRegistryComponents(registryId: string, page = 1, pageSize = 10): Observable<RegistryComponentsResponseJsonApi> {
    const params: Record<string, unknown> = {
      'embed[]': 'bibliographic_contributors',
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
