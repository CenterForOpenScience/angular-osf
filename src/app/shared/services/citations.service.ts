import { map, Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { ResourceType } from '@shared/enums';
import { CitationsMapper } from '@shared/mappers';
import { CitationStylesJsonApiResponse, DefaultCitation, DefaultCitationJsonApi } from '@shared/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CitationsService {
  private readonly http = inject(HttpClient);
  private readonly jsonApiService = inject(JsonApiService);

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
    [ResourceType.Preprint, 'preprints'],
  ]);

  fetchDefaultCitation(
    resourceType: ResourceType,
    resourceId: string,
    citationId: string
  ): Observable<DefaultCitation> {
    const baseUrl = this.getBaseUrl(resourceType, resourceId);
    return this.http
      .get<DefaultCitationJsonApi>(`${baseUrl}/${citationId}/`)
      .pipe(map((response) => CitationsMapper.fromGetDefaultResponse(response)));
  }

  fetchCitationStyles(searchQuery?: string) {
    const baseUrl = environment.apiUrl;

    const params = new HttpParams().set('filter[title,short_title]', searchQuery || '').set('page[size]', '100');

    return this.http
      .get<CitationStylesJsonApiResponse>(`${baseUrl}/citations/styles`, { params })
      .pipe(map((response) => CitationsMapper.fromGetCitationStylesResponse(response)));
  }

  private getBaseUrl(resourceType: ResourceType, resourceId: string): string {
    const baseUrl = `${environment.apiUrl}`;
    const resourcePath = this.urlMap.get(resourceType);

    if (!resourcePath) {
      throw new Error(`Unsupported resource type: ${resourceType}`);
    }

    return `${baseUrl}/${resourcePath}/${resourceId}/citation`;
  }
}
