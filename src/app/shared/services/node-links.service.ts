import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/shared/services';
import { ComponentsMapper } from '@shared/mappers/components';
import { ComponentGetResponseJsonApi, ComponentOverview, JsonApiResponse, MyResourcesItem } from '@shared/models';
import { NodeLinkJsonApi } from '@shared/models/node-links';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NodeLinksService {
  jsonApiService = inject(JsonApiService);

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
      `${environment.apiUrl}/nodes/${currentProjectId}/relationships/linked_${resource.type}/`,
      payload
    );
  }

  deleteNodeLink(projectId: string, resource: ComponentOverview): Observable<void> {
    const payload = {
      data: [
        {
          type: resource.type,
          id: resource.id,
        },
      ],
    };

    return this.jsonApiService.delete(
      `${environment.apiUrl}/nodes/${projectId}/relationships/linked_${resource.type}/`,
      payload
    );
  }

  fetchLinkedProjects(projectId: string): Observable<ComponentOverview[]> {
    const params: Record<string, unknown> = {
      embed: 'bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
    };

    return this.jsonApiService
      .get<
        JsonApiResponse<ComponentGetResponseJsonApi[], null>
      >(`${environment.apiUrl}/nodes/${projectId}/linked_nodes/`, params)
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
      >(`${environment.apiUrl}/nodes/${projectId}/linked_registrations/`, params)
      .pipe(
        map((response) => {
          return response.data.map((item) => ComponentsMapper.fromGetComponentResponse(item));
        })
      );
  }
}
