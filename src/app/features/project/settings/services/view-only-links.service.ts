import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

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
    return this.jsonApiService
      .get<ViewOnlyLinksResponseModel>(`${environment.apiUrl}/nodes/${projectId}/view_only_links`)
      .pipe(map((response) => ViewOnlyLinksMapper.fromResponse(response, projectId)));
  }

  createViewOnlyLink(projectId: string, payload: ViewOnlyLink): Observable<PaginatedViewOnlyLinksModel> {
    return this.jsonApiService
      .post<ViewOnlyLink>(`${environment.apiUrl}/nodes/${projectId}/view_only_links/`, {
        data: { ...payload },
      })
      .pipe(map((response) => ViewOnlyLinksMapper.fromSingleResponse(response, projectId)));
  }

  deleteLink(projectId: string, linkId: string): Observable<void> {
    return this.jsonApiService.delete(`${environment.apiUrl}/nodes/${projectId}/view_only_links/${linkId}`);
  }
}
