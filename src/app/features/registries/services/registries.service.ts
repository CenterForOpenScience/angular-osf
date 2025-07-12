import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponseWithPaging } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';
import { RegistrationMapper } from '@osf/shared/mappers/registration';
import {
  DraftRegistrationDataJsonApi,
  DraftRegistrationModel,
  DraftRegistrationRelationshipsJsonApi,
  DraftRegistrationResponseJsonApi,
  RegistrationAttributesJsonApi,
  RegistrationCard,
  RegistrationDataJsonApi,
  RegistrationModel,
  RegistrationResponseJsonApi,
} from '@osf/shared/models';

import { PageSchemaMapper } from '../mappers';
import { PageSchema, SchemaBlocksResponseJsonApi } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistriesService {
  private apiUrl = environment.apiUrl;
  private readonly jsonApiService = inject(JsonApiService);

  createDraft(registrationSchemaId: string, projectId?: string | undefined): Observable<DraftRegistrationModel> {
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
      .post<DraftRegistrationResponseJsonApi>(`${this.apiUrl}/draft_registrations/`, payload)
      .pipe(map((response) => RegistrationMapper.fromDraftRegistrationResponse(response.data)));
  }

  getDraft(draftId: string): Observable<DraftRegistrationModel> {
    return this.jsonApiService
      .get<DraftRegistrationResponseJsonApi>(`${this.apiUrl}/draft_registrations/${draftId}/`)
      .pipe(map((response) => RegistrationMapper.fromDraftRegistrationResponse(response.data)));
  }

  updateDraft(
    id: string,
    attributes: Partial<RegistrationAttributesJsonApi>,
    relationships?: Partial<DraftRegistrationRelationshipsJsonApi>
  ): Observable<DraftRegistrationModel> {
    const payload = {
      data: {
        id,
        attributes,
        relationships,
        type: 'draft_registrations', // force the correct type
      },
    };

    return this.jsonApiService
      .patch<DraftRegistrationDataJsonApi>(`${this.apiUrl}/draft_registrations/${id}/`, payload)
      .pipe(map((response) => RegistrationMapper.fromDraftRegistrationResponse(response)));
  }

  deleteDraft(draftId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/draft_registrations/${draftId}/`);
  }

  registerDraft(draftId: string, embargoDate: string, projectId?: string): Observable<RegistrationModel> {
    const payload = {
      data: {
        type: 'registrations',
        attributes: {
          embargo_end_date: embargoDate,
          draft_registration: draftId,
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
      .post<RegistrationResponseJsonApi>(`${this.apiUrl}/registrations/`, payload)
      .pipe(map((response) => RegistrationMapper.fromRegistrationResponse(response.data)));
  }

  getSchemaBlocks(registrationSchemaId: string): Observable<PageSchema[]> {
    return this.jsonApiService
      .get<SchemaBlocksResponseJsonApi>(`${this.apiUrl}/schemas/registrations/${registrationSchemaId}/schema_blocks/`)
      .pipe(map((response) => PageSchemaMapper.fromSchemaBlocksResponse(response)));
  }

  getDraftRegistrations(): Observable<{ data: RegistrationCard[]; totalCount: number }> {
    const params = {
      'page[size]': 10,
      embed: ['bibliographic_contributors', 'registration_schema', 'provider'],
    };
    return this.jsonApiService
      .get<
        JsonApiResponseWithPaging<DraftRegistrationDataJsonApi[], null>
      >(`${this.apiUrl}/draft_registrations/`, params)
      .pipe(
        map((response) => {
          const data = response.data.map((registration: DraftRegistrationDataJsonApi) =>
            RegistrationMapper.fromDraftToRegistrationCard(registration)
          );
          return {
            data,
            totalCount: response.links.meta?.total,
          };
        })
      );
  }

  getSubmittedRegistrations(): Observable<{ data: RegistrationCard[]; totalCount: number }> {
    return this.jsonApiService
      .get<JsonApiResponseWithPaging<RegistrationDataJsonApi[], null>>(`${this.apiUrl}/registrations/`, {
        'page[size]': 10,
        embed: ['bibliographic_contributors', 'registration_schema', 'provider'],
      })
      .pipe(
        map((response) => {
          const data = response.data.map((registration: RegistrationDataJsonApi) =>
            RegistrationMapper.fromRegistrationToRegistrationCard(registration)
          );
          return {
            data,
            totalCount: response.links.meta?.total,
          };
        })
      );
  }
}
