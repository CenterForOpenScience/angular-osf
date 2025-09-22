import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { ComponentsMapper } from '../mappers';
import { ComponentGetResponseJsonApi, ComponentOverview, JsonApiResponse, MyResourcesItem } from '../models';
import { NodeLinkJsonApi } from '../models/node-links';

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
      `${this.apiUrl}/nodes/${projectId}/relationships/linked_${resource.type}/`,
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
      >(`${this.apiUrl}/nodes/${projectId}/linked_nodes/`, params)
      .pipe(map((response) => response.data.map((item) => ComponentsMapper.fromGetComponentResponse(item))));
  }

  fetchLinkedRegistrations(projectId: string): Observable<ComponentOverview[]> {
    const params: Record<string, unknown> = {
      embed: 'bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
    };

    return this.jsonApiService
      .get<
        JsonApiResponse<ComponentGetResponseJsonApi[], null>
      >(`${this.apiUrl}/nodes/${projectId}/linked_registrations/`, params)
      .pipe(map((response) => response.data.map((item) => ComponentsMapper.fromGetComponentResponse(item))));
  }
}
