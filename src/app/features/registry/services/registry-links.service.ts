import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/shared/services';

import { BibliographicContributorsMapper, LinkedNodesMapper, LinkedRegistrationsMapper } from '../mappers';
import {
  BibliographicContributorsResponse,
  LinkedNodesJsonApiResponse,
  LinkedNodesResponseJsonApi,
  LinkedRegistrationsJsonApiResponse,
  LinkedRegistrationsResponseJsonApi,
  NodeBibliographicContributor,
} from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistryLinksService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly apiUrl = environment.apiUrl;

  getLinkedNodes(registryId: string, page = 1, pageSize = 10): Observable<LinkedNodesResponseJsonApi> {
    const params: Record<string, unknown> = {
      page: page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<LinkedNodesJsonApiResponse>(`${this.apiUrl}/registrations/${registryId}/linked_nodes/`, params)
      .pipe(
        map((response) => ({
          data: response.data.map(LinkedNodesMapper.fromApiResponse),
          meta: response.meta,
          links: response.links,
        }))
      );
  }

  getLinkedRegistrations(registryId: string, page = 1, pageSize = 10): Observable<LinkedRegistrationsResponseJsonApi> {
    const params: Record<string, unknown> = {
      page: page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<LinkedRegistrationsJsonApiResponse>(
        `${this.apiUrl}/registrations/${registryId}/linked_registrations/`,
        params
      )
      .pipe(
        map((response) => ({
          data: response.data.map(LinkedRegistrationsMapper.fromApiResponse),
          meta: response.meta,
          links: response.links,
        }))
      );
  }

  getBibliographicContributors(nodeId: string): Observable<NodeBibliographicContributor[]> {
    const params: Record<string, unknown> = {
      embed: 'users',
    };

    return this.jsonApiService
      .get<BibliographicContributorsResponse>(`${this.apiUrl}/nodes/${nodeId}/bibliographic_contributors/`, params)
      .pipe(map((response) => BibliographicContributorsMapper.fromApiResponseArray(response.data)));
  }

  getBibliographicContributorsForRegistration(registrationId: string): Observable<NodeBibliographicContributor[]> {
    const params: Record<string, unknown> = {
      embed: 'users',
    };

    return this.jsonApiService
      .get<BibliographicContributorsResponse>(
        `${this.apiUrl}/registrations/${registrationId}/bibliographic_contributors/`,
        params
      )
      .pipe(map((response) => BibliographicContributorsMapper.fromApiResponseArray(response.data)));
  }
}
