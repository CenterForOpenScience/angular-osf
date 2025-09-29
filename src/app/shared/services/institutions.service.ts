import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ResourceType } from '@shared/enums';
import { InstitutionsMapper } from '@shared/mappers';
import {
  Institution,
  InstitutionJsonApiResponse,
  InstitutionsJsonApiResponse,
  InstitutionsWithMetaJsonApiResponse,
  InstitutionsWithTotalCount,
} from '@shared/models';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class InstitutionsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Preprint, 'preprints'],
    [ResourceType.Agent, 'users'],
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
    [ResourceType.DraftRegistration, 'draft_registrations'],
  ]);

  getInstitutions(searchValue?: string): Observable<InstitutionsWithTotalCount> {
    const params: Record<string, unknown> = {};

    if (searchValue && searchValue.trim()) {
      params['filter[name]'] = searchValue.trim();
    }

    return this.jsonApiService
      .get<InstitutionsWithMetaJsonApiResponse>(`${this.apiUrl}/institutions/`, params)
      .pipe(map((response) => InstitutionsMapper.fromResponseWithMeta(response)));
  }

  getUserInstitutions(): Observable<Institution[]> {
    const url = `${this.apiUrl}/users/me/institutions/`;

    return this.jsonApiService
      .get<InstitutionsJsonApiResponse>(url)
      .pipe(map((response) => InstitutionsMapper.fromInstitutionsResponse(response)));
  }

  getInstitutionById(institutionId: string): Observable<Institution> {
    return this.jsonApiService
      .get<InstitutionJsonApiResponse>(`${this.apiUrl}/institutions/${institutionId}/`)
      .pipe(map((response) => InstitutionsMapper.fromInstitutionData(response.data)));
  }

  deleteUserInstitution(id: string, userId: string): Observable<void> {
    const payload = {
      data: [{ id: id, type: 'institutions' }],
    };

    return this.jsonApiService.delete(`${this.apiUrl}/users/${userId}/relationships/institutions/`, payload);
  }

  getResourceInstitutions(resourceId: string, resourceType: ResourceType): Observable<Institution[]> {
    const url = `${this.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/institutions/`;

    return this.jsonApiService
      .get<InstitutionsJsonApiResponse>(url)
      .pipe(map((response) => InstitutionsMapper.fromInstitutionsResponse(response)));
  }

  updateResourceInstitutions(
    resourceId: string,
    resourceType: ResourceType,
    institutions: Institution[]
  ): Observable<void> {
    const baseUrl = `${this.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/relationships/institutions/`;
    const payload = {
      data: institutions.map((item) => ({ id: item.id, type: 'institutions' })),
    };

    return this.jsonApiService.put(baseUrl, payload);
  }
}
