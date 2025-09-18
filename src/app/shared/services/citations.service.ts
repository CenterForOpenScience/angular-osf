import { map, Observable } from 'rxjs';

import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { ResourceType } from '../enums';
import { CitationsMapper } from '../mappers';
import {
  CitationStyle,
  CitationStyleJsonApi,
  CustomCitationPayload,
  DefaultCitation,
  DefaultCitationJsonApi,
  JsonApiResponse,
  StyledCitation,
  StyledCitationJsonApi,
} from '../models';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class CitationsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly apiUrl = `${this.environment.apiDomainUrl}/v2`;

  private readonly urlMap = new Map<ResourceType, string>([[ResourceType.Preprint, 'preprints']]);

  fetchDefaultCitation(
    resourceType: ResourceType | string,
    resourceId: string,
    citationId: string
  ): Observable<DefaultCitation> {
    const baseUrl = this.getBaseCitationUrl(resourceType, resourceId);
    return this.jsonApiService
      .get<JsonApiResponse<DefaultCitationJsonApi, null>>(`${baseUrl}/${citationId}/`)
      .pipe(map((response) => CitationsMapper.fromGetDefaultResponse(response.data)));
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

  fetchStyledCitation(
    resourceType: ResourceType | string,
    resourceId: string,
    citationStyle: string
  ): Observable<StyledCitation> {
    const baseUrl = this.getBaseCitationUrl(resourceType, resourceId);

    return this.jsonApiService
      .get<JsonApiResponse<StyledCitationJsonApi, null>>(`${baseUrl}/${citationStyle}/`)
      .pipe(map((response) => CitationsMapper.fromGetStyledCitationResponse(response.data)));
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
}
