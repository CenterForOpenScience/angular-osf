import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';
import { DraftRegistrationModel, RegistrationModel } from '@osf/shared/models/registration';

import { PageSchemaMapper } from '../mappers';
import { RegistrationMapper } from '../mappers/registration.mapper';
import {
  PageSchema,
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
      .post<RegistrationResponseJsonApi>(`${this.apiUrl}/draft_registrations/`, payload)
      .pipe(map((response) => RegistrationMapper.fromDraftRegistrationResponse(response.data)));
  }

  getDraft(draftId: string): Observable<DraftRegistrationModel> {
    return this.jsonApiService
      .get<RegistrationResponseJsonApi>(`${this.apiUrl}/draft_registrations/${draftId}/`)
      .pipe(map((response) => RegistrationMapper.fromDraftRegistrationResponse(response.data)));
  }

  updateDraft(
    id: string,
    attributes: Partial<RegistrationAttributesJsonApi>,
    relationships?: Partial<RegistrationRelationshipsJsonApi>
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
      .patch<RegistrationDataJsonApi>(`${this.apiUrl}/draft_registrations/${id}/`, payload)
      .pipe(map((response) => RegistrationMapper.fromDraftRegistrationResponse(response)));
  }

  deleteDraft(draftId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/draft_registrations/${draftId}/`);
  }

  registerDraft(
    draftId: string,
    embargoDate: string,
    providerId: string,
    projectId?: string
  ): Observable<RegistrationModel> {
    const payload = RegistrationMapper.toRegistrationPayload(draftId, embargoDate, providerId, projectId);
    return this.jsonApiService
      .post<RegistrationResponseJsonApi>(`${this.apiUrl}/registrations/`, payload)
      .pipe(map((response) => RegistrationMapper.fromRegistrationResponse(response.data)));
  }

  getSchemaBlocks(registrationSchemaId: string): Observable<PageSchema[]> {
    return this.jsonApiService
      .get<SchemaBlocksResponseJsonApi>(`${this.apiUrl}/schemas/registrations/${registrationSchemaId}/schema_blocks/`)
      .pipe(map((response) => PageSchemaMapper.fromSchemaBlocksResponse(response)));
  }
}
