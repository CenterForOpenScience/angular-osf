import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@core/models';
import { JsonApiService } from '@core/services';

import { ViewOnlyLinksMapper } from '../mappers';
import { PaginatedViewOnlyLinksModel, ViewOnlyLink, ViewOnlyLinksResponseModel } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ViewOnlyLinksService {
  private readonly jsonApiService = inject(JsonApiService);

  getViewOnlyLinksData(projectId: string): Observable<PaginatedViewOnlyLinksModel> {
    const params: Record<string, unknown> = { embed: 'creator' };

    return this.jsonApiService
      .get<ViewOnlyLinksResponseModel>(`${environment.apiUrl}/nodes/${projectId}/view_only_links`, params)
      .pipe(map((response) => ViewOnlyLinksMapper.fromResponse(response, projectId)));
  }

  createViewOnlyLink(projectId: string, payload: ViewOnlyLink): Observable<PaginatedViewOnlyLinksModel> {
    const data = { data: { ...payload } };
    const params: Record<string, unknown> = { embed: 'creator' };

    return this.jsonApiService
      .post<
        JsonApiResponse<ViewOnlyLink, null>
      >(`${environment.apiUrl}/nodes/${projectId}/view_only_links/`, data, params)
      .pipe(map((response) => ViewOnlyLinksMapper.fromSingleResponse(response.data, projectId)));
  }

  deleteLink(projectId: string, linkId: string): Observable<void> {
    return this.jsonApiService.delete(`${environment.apiUrl}/nodes/${projectId}/view_only_links/${linkId}`);
  }
}
