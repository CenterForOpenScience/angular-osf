import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { BaseNodeMapper } from '../mappers/nodes';
import { JsonApiResponse } from '../models/common/json-api.model';
import { MyResourcesItem } from '../models/my-resources/my-resources.models';
import { NodeLinkJsonApi } from '../models/node-links/node-link-json-api.model';
import { NodeModel } from '../models/nodes/base-node.model';
import { NodesResponseJsonApi } from '../models/nodes/nodes-json-api.model';
import { PaginatedData } from '../models/paginated-data.model';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class NodeLinksService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  createNodeLink(
    currentProjectId: string,
    resource: MyResourcesItem
  ): Observable<JsonApiResponse<NodeLinkJsonApi, null>> {
    const payload = {
      data: [
        {
          type: resource.type,
          id: resource.id,
        },
      ],
    };

    return this.jsonApiService.post<JsonApiResponse<NodeLinkJsonApi, null>>(
      `${this.apiUrl}/nodes/${currentProjectId}/relationships/linked_${resource.type}/`,
      payload
    );
  }

  deleteNodeLink(projectId: string, resource: NodeModel): Observable<void> {
    const payload = {
      data: [
        {
          type: resource.type,
          id: resource.id,
        },
      ],
    };

    return this.jsonApiService.delete(
      `${this.apiUrl}/nodes/${projectId}/relationships/linked_${resource.type}/`,
      payload
    );
  }

  fetchLinkedProjects(projectId: string, page: number, pageSize: number): Observable<PaginatedData<NodeModel[]>> {
    const params: Record<string, unknown> = {
      embed: 'bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
      page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<NodesResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/linked_nodes/`, params)
      .pipe(map((response) => BaseNodeMapper.getNodesWithEmbedsAndTotalData(response)));
  }

  fetchLinkedRegistrations(projectId: string, page: number, pageSize: number): Observable<PaginatedData<NodeModel[]>> {
    const params: Record<string, unknown> = {
      embed: 'bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
      page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<NodesResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/linked_registrations/`, params)
      .pipe(map((response) => BaseNodeMapper.getNodesWithEmbedsAndTotalData(response)));
  }
}
