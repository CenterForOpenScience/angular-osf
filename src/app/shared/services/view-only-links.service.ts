import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@shared/models';
import { JsonApiService } from '@shared/services';

import { ResourceType } from '../enums';
import { ViewOnlyLinksMapper } from '../mappers';
import { NodeResponseModel } from '../models';
import {
  PaginatedViewOnlyLinksModel,
  ViewOnlyLinkJsonApi,
  ViewOnlyLinksResponseJsonApi,
} from '../models/view-only-links';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ViewOnlyLinksService {
  private readonly jsonApiService = inject(JsonApiService);

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
  ]);

  getResourceById(resourceId: string, resourceType: ResourceType): Observable<NodeResponseModel> {
    const resourcePath = this.urlMap.get(resourceType);
    return this.jsonApiService.get(`${environment.apiUrl}/${resourcePath}/${resourceId}`);
  }

  getViewOnlyLinksData(projectId: string, resourceType: ResourceType): Observable<PaginatedViewOnlyLinksModel> {
    const resourcePath = this.urlMap.get(resourceType);
    const params: Record<string, unknown> = { embed: 'creator' };

    return this.jsonApiService
      .get<ViewOnlyLinksResponseJsonApi>(`${environment.apiUrl}/${resourcePath}/${projectId}/view_only_links`, params)
      .pipe(map((response) => ViewOnlyLinksMapper.fromResponse(response, projectId)));
  }

  createViewOnlyLink(
    projectId: string,
    resourceType: ResourceType,
    payload: ViewOnlyLinkJsonApi
  ): Observable<PaginatedViewOnlyLinksModel> {
    const resourcePath = this.urlMap.get(resourceType);
    const data = { data: { ...payload } };
    const params: Record<string, unknown> = { embed: 'creator' };

    return this.jsonApiService
      .post<
        JsonApiResponse<ViewOnlyLinkJsonApi, null>
      >(`${environment.apiUrl}/${resourcePath}/${projectId}/view_only_links/`, data, params)
      .pipe(map((response) => ViewOnlyLinksMapper.fromSingleResponse(response.data, projectId)));
  }

  deleteLink(projectId: string, resourceType: ResourceType, linkId: string): Observable<void> {
    const resourcePath = this.urlMap.get(resourceType);
    return this.jsonApiService.delete(`${environment.apiUrl}/${resourcePath}/${projectId}/view_only_links/${linkId}`);
  }
}
