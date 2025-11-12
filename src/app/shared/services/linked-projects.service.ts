import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { BaseNodeMapper } from '../mappers/nodes';
import { NodeModel } from '../models/nodes/base-node.model';
import { NodesResponseJsonApi } from '../models/nodes/nodes-json-api.model';
import { PaginatedData } from '../models/paginated-data.model';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class LinkedProjectsService {
  private jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  fetchAllLinkedProjects(
    resourceId: string,
    resourceType: string,
    pageNumber?: number,
    pageSize?: number
  ): Observable<PaginatedData<NodeModel[]>> {
    const params: Record<string, unknown> = {
      embed: 'bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
    };

    if (pageNumber) {
      params['page'] = pageNumber;
    }

    if (pageSize) {
      params['page[size]'] = pageSize;
    }

    return this.jsonApiService
      .get<NodesResponseJsonApi>(`${this.apiUrl}/${resourceType}/${resourceId}/linked_by_nodes/`, params)
      .pipe(map((res) => BaseNodeMapper.getNodesWithEmbedsAndTotalData(res)));
  }
}
