import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@core/models';
import { JsonApiService } from '@osf/core/services';
import { NodeLinksMapper } from '@shared/mappers';
import { ComponentsMapper } from '@shared/mappers/components';
import { ComponentGetResponseJsonApi, ComponentOverview } from '@shared/models';
import { NodeLink, NodeLinkJsonApi } from '@shared/models/node-links';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NodeLinksService {
  jsonApiService = inject(JsonApiService);

  createNodeLink(currentProjectId: string, linkProjectId: string): Observable<NodeLink> {
    const payload = {
      data: {
        type: 'node_links',
        relationships: {
          nodes: {
            data: {
              type: 'nodes',
              id: linkProjectId,
            },
          },
        },
      },
    };

    return this.jsonApiService
      .post<
        JsonApiResponse<NodeLinkJsonApi, null>
      >(`${environment.apiUrl}/nodes/${currentProjectId}/node_links/`, payload)
      .pipe(
        map((response) => {
          return NodeLinksMapper.fromNodeLinkResponse(response.data);
        })
      );
  }

  fetchAllNodeLinks(projectId: string): Observable<NodeLink[]> {
    const params: Record<string, unknown> = {
      'fields[nodes]': 'relationships',
    };

    return this.jsonApiService
      .get<JsonApiResponse<NodeLinkJsonApi[], null>>(`${environment.apiUrl}/nodes/${projectId}/node_links/`, params)
      .pipe(
        map((response) => {
          return response.data.map((item) => NodeLinksMapper.fromNodeLinkResponse(item));
        })
      );
  }

  deleteNodeLink(projectId: string, nodeLinkId: string): Observable<void> {
    return this.jsonApiService.delete(`${environment.apiUrl}/nodes/${projectId}/node_links/${nodeLinkId}/`);
  }

  fetchLinkedProjects(projectId: string): Observable<ComponentOverview[]> {
    const params: Record<string, unknown> = {
      embed: 'bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
    };

    return this.jsonApiService
      .get<
        JsonApiResponse<ComponentGetResponseJsonApi[], null>
      >(`${environment.apiUrl}/nodes/${projectId}/linked_nodes`, params)
      .pipe(
        map((response) => {
          return response.data.map((item) => ComponentsMapper.fromGetComponentResponse(item));
        })
      );
  }

  fetchLinkedRegistrations(projectId: string): Observable<ComponentOverview[]> {
    const params: Record<string, unknown> = {
      embed: 'bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
    };

    return this.jsonApiService
      .get<
        JsonApiResponse<ComponentGetResponseJsonApi[], null>
      >(`${environment.apiUrl}/nodes/${projectId}/linked_registrations`, params)
      .pipe(
        map((response) => {
          return response.data.map((item) => ComponentsMapper.fromGetComponentResponse(item));
        })
      );
  }
}
