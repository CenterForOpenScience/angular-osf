import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { JsonApiService } from '@osf/shared/services/json-api.service';

import { LinkedNodesMapper, LinkedRegistrationsMapper } from '../mappers';
import {
  LinkedNodesJsonApiResponse,
  LinkedNodesResponseJsonApi,
  LinkedRegistrationsJsonApiResponse,
  LinkedRegistrationsResponseJsonApi,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class RegistryLinksService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getLinkedNodes(registryId: string, page = 1, pageSize = 10): Observable<LinkedNodesResponseJsonApi> {
    const params: Record<string, unknown> = {
      'embed[]': 'bibliographic_contributors',
      page: page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<LinkedNodesJsonApiResponse>(`${this.apiUrl}/registrations/${registryId}/linked_nodes/`, params)
      .pipe(
        map((response) => ({
          data: response.data.map(LinkedNodesMapper.fromApiResponse),
          meta: response.meta,
          links: response.links,
        }))
      );
  }

  getLinkedRegistrations(registryId: string, page = 1, pageSize = 10): Observable<LinkedRegistrationsResponseJsonApi> {
    const params: Record<string, unknown> = {
      'embed[]': 'bibliographic_contributors',
      page: page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<LinkedRegistrationsJsonApiResponse>(
        `${this.apiUrl}/registrations/${registryId}/linked_registrations/`,
        params
      )
      .pipe(
        map((response) => ({
          data: response.data.map(LinkedRegistrationsMapper.fromApiResponse),
          meta: response.meta,
          links: response.links,
        }))
      );
  }
}
