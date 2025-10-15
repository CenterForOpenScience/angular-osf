import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { NodeDataJsonApi } from '@osf/features/project/settings/models';

import { BaseNodeMapper } from '../mappers';
import { NodesWithTotal, ResponseJsonApi } from '../models';

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
  ): Observable<NodesWithTotal> {
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
      .get<ResponseJsonApi<NodeDataJsonApi[]>>(`${this.apiUrl}/${resourceType}/${resourceId}/linked_by_nodes/`, params)
      .pipe(map((res) => BaseNodeMapper.getNodesWithEmbedsAndTotalData(res)));
  }
}
