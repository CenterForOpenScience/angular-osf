import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { PageSchemaMapper, RegistrationMapper } from '@osf/shared/mappers/registration';
import {
  DraftRegistrationDataJsonApi,
  DraftRegistrationModel,
  DraftRegistrationRelationshipsJsonApi,
  DraftRegistrationResponseJsonApi,
  PageSchema,
  RegistrationAttributesJsonApi,
  RegistrationCard,
  RegistrationDataJsonApi,
  RegistrationModel,
  RegistrationResponseJsonApi,
  ResponseJsonApi,
  SchemaBlocksResponseJsonApi,
  SchemaResponse,
  SchemaResponseDataJsonApi,
  SchemaResponseJsonApi,
  SchemaResponsesJsonApi,
} from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { SchemaActionTrigger } from '../enums';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistriesService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly apiUrl = `${environment.apiDomainUrl}/v2`;

  createDraft(
    registrationSchemaId: string,
    provider: string,
    projectId?: string | undefined
  ): Observable<DraftRegistrationModel> {
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
          provider: {
            data: {
              type: 'registration-providers',
              id: provider,
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
    const params = {
      embed: ['branched_from'],
    };
    return this.jsonApiService
      .get<DraftRegistrationResponseJsonApi>(`${this.apiUrl}/draft_registrations/${draftId}/`, params)
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
    const params = {
      embed: ['branched_from'],
    };

    return this.jsonApiService
      .patch<DraftRegistrationDataJsonApi>(`${this.apiUrl}/draft_registrations/${id}/`, payload, params)
      .pipe(map((response) => RegistrationMapper.fromDraftRegistrationResponse(response)));
  }

  deleteDraft(draftId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/draft_registrations/${draftId}/`);
  }

  registerDraft(
    draftId: string,
    embargoDate: string,
    providerId: string,
    projectId?: string,
    components?: string[]
  ): Observable<RegistrationModel> {
    const payload = RegistrationMapper.toRegistrationPayload(draftId, embargoDate, providerId, projectId, components);
    return this.jsonApiService
      .post<RegistrationResponseJsonApi>(`${this.apiUrl}/registrations/`, payload)
      .pipe(map((response) => RegistrationMapper.fromRegistrationResponse(response.data)));
  }

  getSchemaBlocks(registrationSchemaId: string): Observable<PageSchema[]> {
    return this.jsonApiService
      .get<SchemaBlocksResponseJsonApi>(`${this.apiUrl}/schemas/registrations/${registrationSchemaId}/schema_blocks/`)
      .pipe(map((response) => PageSchemaMapper.fromSchemaBlocksResponse(response)));
  }

  getDraftRegistrations(page: number, pageSize: number): Observable<{ data: RegistrationCard[]; totalCount: number }> {
    const params = {
      page,
      'page[size]': pageSize,
      embed: ['bibliographic_contributors', 'registration_schema', 'provider'],
    };
    return this.jsonApiService
      .get<ResponseJsonApi<DraftRegistrationDataJsonApi[]>>(`${this.apiUrl}/draft_registrations/`, params)
      .pipe(
        map((response) => {
          const data = response.data.map((registration: DraftRegistrationDataJsonApi) =>
            RegistrationMapper.fromDraftToRegistrationCard(registration)
          );
          return {
            data,
            totalCount: response.meta?.total,
          };
        })
      );
  }

  getSubmittedRegistrations(
    userId: string,
    page: number,
    pageSize: number
  ): Observable<{ data: RegistrationCard[]; totalCount: number }> {
    const params = {
      page,
      'page[size]': pageSize,
      embed: ['bibliographic_contributors', 'registration_schema', 'provider'],
    };
    return this.jsonApiService
      .get<ResponseJsonApi<RegistrationDataJsonApi[]>>(`${this.apiUrl}/users/${userId}/registrations/`, params)
      .pipe(
        map((response) => {
          const data = response.data.map((registration: RegistrationDataJsonApi) =>
            RegistrationMapper.fromRegistrationToRegistrationCard(registration)
          );
          return {
            data,
            totalCount: response.meta?.total,
          };
        })
      );
  }

  getAllSchemaResponse(registrationId: string): Observable<SchemaResponse[]> {
    const params = {
      embed: ['registration'],
    };
    return this.jsonApiService
      .get<SchemaResponsesJsonApi>(`${this.apiUrl}/registrations/${registrationId}/schema_responses/`, params)
      .pipe(map((response) => response.data.map((item) => RegistrationMapper.fromSchemaResponse(item))));
  }

  getSchemaResponse(schemaResponseId: string): Observable<SchemaResponse> {
    const params = {
      embed: ['registration'],
    };
    return this.jsonApiService
      .get<SchemaResponseJsonApi>(`${this.apiUrl}/schema_responses/${schemaResponseId}/`, params)
      .pipe(map((response) => RegistrationMapper.fromSchemaResponse(response.data)));
  }

  createSchemaResponse(registrationId: string): Observable<SchemaResponse> {
    const payload = {
      data: {
        type: 'schema_responses',
        relationships: {
          registration: {
            data: {
              type: 'registrations',
              id: registrationId,
            },
          },
        },
      },
    };
    const params = {
      embed: ['registration'],
    };
    return this.jsonApiService
      .post<SchemaResponseJsonApi>(`${this.apiUrl}/schema_responses/`, payload, params)
      .pipe(map((response) => RegistrationMapper.fromSchemaResponse(response.data)));
  }

  updateSchemaResponse(
    schemaResponseId: string,
    revisionJustification: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revisionResponses?: Record<string, any>
  ): Observable<SchemaResponse> {
    const payload = {
      data: {
        id: schemaResponseId,
        type: 'schema_responses',
        attributes: {
          revision_justification: revisionJustification,
          revision_responses: revisionResponses,
        },
      },
    };
    const params = {
      embed: ['registration'],
    };
    return this.jsonApiService
      .patch<SchemaResponseDataJsonApi>(`${this.apiUrl}/schema_responses/${schemaResponseId}/`, payload, params)
      .pipe(map((response) => RegistrationMapper.fromSchemaResponse(response)));
  }

  handleSchemaResponse(schemaResponseId: string, trigger: SchemaActionTrigger, comment?: string) {
    const payload = {
      data: {
        type: 'schema_response_actions',
        attributes: {
          trigger,
          comment: comment ? comment : undefined,
        },
        relationships: {
          target: {
            data: {
              type: 'schema-responses',
              id: schemaResponseId,
            },
          },
        },
      },
    };
    return this.jsonApiService.post(`${this.apiUrl}/schema_responses/${schemaResponseId}/actions/`, payload);
  }

  deleteSchemaResponse(schemaResponseId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/schema_responses/${schemaResponseId}/`);
  }
}
