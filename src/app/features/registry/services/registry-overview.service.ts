import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { MapRegistryOverview, MapRegistrySchemaBlock } from '@osf/features/registry/mappers';
import {
  GetRegistryInstitutionsJsonApi,
  GetRegistryOverviewJsonApi,
  GetRegistrySchemaBlockJsonApi,
  GetResourceSubjectsJsonApi,
  RegistryInstitution,
  RegistryOverview,
  RegistryOverviewJsonApiData,
  RegistrySchemaBlock,
  RegistrySubject,
} from '@osf/features/registry/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistryOverviewService {
  private jsonApiService = inject(JsonApiService);

  getRegistrationById(id: string): Observable<RegistryOverview | null> {
    const params = {
      related_counts: 'forks,comments,linked_nodes,linked_registrations,children,wikis',
      'embed[]': [
        'bibliographic_contributors',
        'provider',
        'registration_schema',
        'identifiers',
        'root',
        'schema_responses',
        'files',
        'license',
      ],
    };

    return this.jsonApiService
      .get<GetRegistryOverviewJsonApi>(`${environment.apiUrl}/registrations/${id}`, params)
      .pipe(map((response) => MapRegistryOverview(response.data)));
  }

  getSubjects(registryId: string): Observable<RegistrySubject[]> {
    const params = {
      'page[size]': 100,
      page: 1,
    };

    return this.jsonApiService
      .get<GetResourceSubjectsJsonApi>(`${environment.apiUrl}/registrations/${registryId}/subjects/`, params)
      .pipe(map((response) => response.data.map((subject) => ({ id: subject.id, text: subject.attributes.text }))));
  }

  getInstitutions(registryId: string): Observable<RegistryInstitution[]> {
    const params = {
      'page[size]': 100,
    };

    return this.jsonApiService
      .get<GetRegistryInstitutionsJsonApi>(`${environment.apiUrl}/registrations/${registryId}/institutions/`, params)
      .pipe(
        map((response) =>
          response.data.map((institution) => ({
            id: institution.id,
            logo: institution.attributes.assets.logo,
            logoRounded: institution.attributes.assets.logo_rounded,
          }))
        )
      );
  }

  getSchemaBlocks(schemaLink: string): Observable<RegistrySchemaBlock[]> {
    const params = {
      'page[size]': 100,
      page: 1,
    };

    return this.jsonApiService
      .get<GetRegistrySchemaBlockJsonApi>(`${schemaLink}schema_blocks`, params)
      .pipe(map((response) => response.data.map((block) => MapRegistrySchemaBlock(block.attributes))));
  }

  withdrawRegistration(registryId: string, justification: string): Observable<RegistryOverview | null> {
    const payload = {
      data: {
        id: registryId,
        attributes: {
          withdrawal_justification: justification,
          pending_withdrawal: true,
        },
        relationships: {},
        type: 'registrations',
      },
    };

    return this.jsonApiService
      .patch<RegistryOverviewJsonApiData>(`${environment.apiUrl}/registrations/${registryId}`, payload)
      .pipe(map((response) => MapRegistryOverview(response)));
  }

  makePublic(registryId: string): Observable<RegistryOverview | null> {
    const payload = {
      data: {
        id: registryId,
        attributes: {
          public: true,
        },
        relationships: {},
        type: 'registrations',
      },
    };

    return this.jsonApiService
      .patch<RegistryOverviewJsonApiData>(`${environment.apiUrl}/registrations/${registryId}`, payload)
      .pipe(map((response) => MapRegistryOverview(response)));
  }
}
