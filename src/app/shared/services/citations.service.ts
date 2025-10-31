import { map, Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { ResourceType } from '../enums/resource-type.enum';
import { CitationsMapper } from '../mappers/citations.mapper';
import { CitationStyle } from '../models/citations/citation-style.model';
import { CitationStyleJsonApi } from '../models/citations/citation-style-json-api.model';
import { CustomCitationPayload } from '../models/citations/custom-citation-payload.model';
import { StyledCitation } from '../models/citations/styled-citation.model';
import { StyledCitationJsonApi } from '../models/citations/styled-citation-json-api.model';
import { JsonApiResponse } from '../models/common/json-api.model';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class CitationsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly http = inject(HttpClient);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  private readonly urlMap = new Map<ResourceType, string>([[ResourceType.Preprint, 'preprints']]);

  fetchStyledCitationById(
    resourceType: ResourceType | string,
    resourceId: string,
    citationId: string
  ): Observable<StyledCitation> {
    const baseUrl = this.getBaseCitationUrl(resourceType, resourceId);
    return this.jsonApiService
      .get<JsonApiResponse<StyledCitationJsonApi, null>>(`${baseUrl}/${citationId}/`)
      .pipe(map((response) => CitationsMapper.fromGetStyledCitationResponse(response.data)));
  }

  fetchCitationStyles(searchQuery?: string): Observable<CitationStyle[]> {
    const params = new HttpParams().set('filter[title,short_title]', searchQuery || '').set('page[size]', '100');

    return this.jsonApiService
      .get<JsonApiResponse<CitationStyleJsonApi[], null>>(`${this.apiUrl}/citations/styles/`, { params })
      .pipe(map((response) => CitationsMapper.fromGetCitationStylesResponse(response.data)));
  }

  updateCustomCitation(payload: CustomCitationPayload): Observable<unknown> {
    const citationData = CitationsMapper.toUpdateCustomCitationRequest(payload);

    return this.jsonApiService.patch<unknown>(`${this.apiUrl}/${payload.type}/${payload.id}/`, citationData);
  }

  fetchCustomCitationFile(styleId: string): Observable<string> {
    const url = `/static/vendor/bower_components/styles/${styleId}.csl`;
    return this.http.get(url, { responseType: 'text' });
  }

  private getBaseCitationUrl(resourceType: ResourceType | string, resourceId: string): string {
    let resourceTypeString;

    if (typeof resourceType === 'string') {
      resourceTypeString = resourceType;
    } else {
      resourceTypeString = this.urlMap.get(resourceType);
    }

    return `${this.apiUrl}/${resourceTypeString}/${resourceId}/citation`;
  }

  fetchCitationStylesFromProvider(resourceType: ResourceType, providerId: string) {
    return this.jsonApiService
      .get<
        JsonApiResponse<CitationStyleJsonApi[], null>
      >(`${this.apiUrl}/providers/${this.urlMap.get(resourceType)}/${providerId}/citation_styles/`)
      .pipe(map((response) => CitationsMapper.fromGetCitationStylesResponse(response.data)));
  }
}
