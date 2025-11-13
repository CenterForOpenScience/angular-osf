import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { JsonApiResponse } from '@shared/models/common/json-api.model';

import { ResourceType } from '../enums/resource-type.enum';
import { ViewOnlyLinksMapper } from '../mappers/view-only-links.mapper';
import { PaginatedViewOnlyLinksModel } from '../models/view-only-links/view-only-link.model';
import {
  ViewOnlyLinkJsonApi,
  ViewOnlyLinksResponseJsonApi,
} from '../models/view-only-links/view-only-link-response.model';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class ViewOnlyLinksService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
  ]);

  getViewOnlyLinksData(projectId: string, resourceType: ResourceType): Observable<PaginatedViewOnlyLinksModel> {
    const resourcePath = this.urlMap.get(resourceType);
    const params: Record<string, unknown> = { 'embed[]': ['creator', 'nodes'] };

    return this.jsonApiService
      .get<ViewOnlyLinksResponseJsonApi>(`${this.apiUrl}/${resourcePath}/${projectId}/view_only_links/`, params)
      .pipe(map((response) => ViewOnlyLinksMapper.fromResponse(response, projectId)));
  }

  createViewOnlyLink(
    projectId: string,
    resourceType: ResourceType,
    payload: ViewOnlyLinkJsonApi
  ): Observable<PaginatedViewOnlyLinksModel> {
    const resourcePath = this.urlMap.get(resourceType);
    const data = { data: { ...payload } };
    const params: Record<string, unknown> = { 'embed[]': ['creator', 'nodes'] };

    return this.jsonApiService
      .post<
        JsonApiResponse<ViewOnlyLinkJsonApi, null>
      >(`${this.apiUrl}/${resourcePath}/${projectId}/view_only_links/`, data, params)
      .pipe(map((response) => ViewOnlyLinksMapper.fromSingleResponse(response.data, projectId)));
  }

  deleteLink(projectId: string, resourceType: ResourceType, linkId: string): Observable<void> {
    const resourcePath = this.urlMap.get(resourceType);

    return this.jsonApiService.delete(`${this.apiUrl}/${resourcePath}/${projectId}/view_only_links/${linkId}`);
  }
}
