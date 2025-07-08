import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';

import { PageSchemaMapper } from '../mappers';
import { RegistrationMapper } from '../mappers/registration.mapper';
import {
  PageSchema,
  Registration,
  RegistrationAttributesJsonApi,
  RegistrationDataJsonApi,
  RegistrationRelationshipsJsonApi,
  RegistrationResponseJsonApi,
  SchemaBlocksResponseJsonApi,
} from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistriesService {
  private apiUrl = environment.apiUrl;
  private readonly jsonApiService = inject(JsonApiService);

  createDraft(registrationSchemaId: string, projectId?: string | undefined): Observable<Registration> {
    const payload = {
      data: {
        type: 'draft_registrations',
        relationships: {
          branched_from: projectId
            ? {
                data: {
                  type: 'nodes',
                  id: projectId,
                },
              }
            : undefined,
          registration_schema: {
            data: {
              type: 'registration-schemas',
              id: registrationSchemaId,
            },
          },
        },
      },
    };
    return this.jsonApiService
      .post<RegistrationResponseJsonApi>(`${this.apiUrl}/draft_registrations/`, payload)
      .pipe(map((response) => RegistrationMapper.fromRegistrationResponse(response.data)));
  }

  getDraft(draftId: string): Observable<Registration> {
    return this.jsonApiService
      .get<RegistrationResponseJsonApi>(`${this.apiUrl}/draft_registrations/${draftId}/`)
      .pipe(map((response) => RegistrationMapper.fromRegistrationResponse(response.data)));
  }

  updateDraft(
    id: string,
    attributes: Partial<RegistrationAttributesJsonApi>,
    relationships?: Partial<RegistrationRelationshipsJsonApi>
  ): Observable<Registration> {
    const payload = {
      data: {
        id,
        attributes,
        relationships,
        type: 'draft_registrations', // force the correct type
      },
    };

    return this.jsonApiService
      .patch<RegistrationDataJsonApi>(`${this.apiUrl}/draft_registrations/${id}/`, payload)
      .pipe(map((response) => RegistrationMapper.fromRegistrationResponse(response)));
  }

  deleteDraft(draftId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/draft_registrations/${draftId}/`);
  }

  registerDraft(draftId: string, embargoDate: string, projectId?: string): Observable<Registration> {
    const payload = {
      data: {
        type: 'registrations',
        attributes: {
          embargo_end_date: embargoDate,
          draft_registration_id: draftId,
        },
        relationships: {
          registered_from: projectId
            ? {
                data: {
                  type: 'nodes',
                  id: projectId,
                },
              }
            : undefined,
        },
        provider: {
          data: {
            type: 'registration-providers',
            id: 'osf', // Assuming 'osf' is the default provider
          },
        },
      },
    };
    return this.jsonApiService
      .post<RegistrationResponseJsonApi>(`${this.apiUrl}/registrations`, payload)
      .pipe(map((response) => RegistrationMapper.fromRegistrationResponse(response.data)));
  }

  getSchemaBlocks(registrationSchemaId: string): Observable<PageSchema[]> {
    return this.jsonApiService
      .get<SchemaBlocksResponseJsonApi>(`${this.apiUrl}/schemas/registrations/${registrationSchemaId}/schema_blocks/`)
      .pipe(map((response) => PageSchemaMapper.fromSchemaBlocksResponse(response)));
  }
}
