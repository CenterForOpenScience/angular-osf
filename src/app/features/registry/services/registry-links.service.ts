import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { NodesResponseJsonApi } from '@osf/shared/models/nodes/nodes-json-api.model';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

import { LinkedNodesMapper, LinkedRegistrationsMapper } from '../mappers';
import { LinkedNode, LinkedRegistration, LinkedRegistrationsJsonApiResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class RegistryLinksService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getLinkedNodes(
    registryId: string,
    page = 1,
    pageSize = DEFAULT_TABLE_PARAMS.rows
  ): Observable<PaginatedData<LinkedNode[]>> {
    const params: Record<string, unknown> = {
      'embed[]': 'bibliographic_contributors',
      page: page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<NodesResponseJsonApi>(`${this.apiUrl}/registrations/${registryId}/linked_nodes/`, params)
      .pipe(
        map((response) => ({
          data: response.data.map(LinkedNodesMapper.fromApiResponse),
          totalCount: response.meta.total,
          pageSize: response.meta.per_page ?? DEFAULT_TABLE_PARAMS.rows,
        }))
      );
  }

  getLinkedRegistrations(
    registryId: string,
    page = 1,
    pageSize = DEFAULT_TABLE_PARAMS.rows
  ): Observable<PaginatedData<LinkedRegistration[]>> {
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
          totalCount: response.meta.total,
          pageSize: response.meta.per_page ?? DEFAULT_TABLE_PARAMS.rows,
        }))
      );
  }
}
