import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';
import { AddContributorType } from '@osf/shared/components/contributors/enums';
import { ContributorsMapper } from '@osf/shared/components/contributors/mappers';
import { ContributorAddModel, ContributorModel, ContributorResponse } from '@osf/shared/components/contributors/models';

import { PageSchemaMapper } from '../mappers';
import { RegistrationMapper } from '../mappers/registration.mapper';
import {
  PageSchema,
  Registration,
  RegistrationDataJsonApi,
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
      .post<RegistrationDataJsonApi>(`${this.apiUrl}/draft_registrations/`, payload)
      .pipe(map((response) => RegistrationMapper.fromRegistrationResponse(response)));
  }

  getDraft(draftId: string): Observable<Registration> {
    return this.jsonApiService
      .get<RegistrationResponseJsonApi>(`${this.apiUrl}/draft_registrations/${draftId}/`)
      .pipe(map((response) => RegistrationMapper.fromRegistrationResponse(response.data)));
  }

  updateDraft(draftId: string, data: Registration): Observable<RegistrationDataJsonApi> {
    const payload = {
      data: {
        id: draftId,
        type: 'draft_registrations',
        attributes: { ...data },
        relationships: {},
      },
    };
    return this.jsonApiService.patch(`${this.apiUrl}/draft_registrations/${draftId}/`, payload);
  }

  deleteDraft(draftId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/draft_registrations/${draftId}/`);
  }

  getSchemaBlocks(registrationSchemaId: string): Observable<PageSchema[]> {
    return this.jsonApiService
      .get<SchemaBlocksResponseJsonApi>(`${this.apiUrl}/schemas/registrations/${registrationSchemaId}/schema_blocks/`)
      .pipe(map((response) => PageSchemaMapper.fromSchemaBlocksResponse(response)));
  }

  getContributors(draftId: string): Observable<ContributorModel[]> {
    return this.jsonApiService
      .get<JsonApiResponse<ContributorResponse[], null>>(`${this.apiUrl}/draft_registrations/${draftId}/contributors/`)
      .pipe(map((contributors) => ContributorsMapper.fromResponse(contributors.data)));
  }

  addContributor(draftId: string, data: ContributorAddModel): Observable<ContributorModel> {
    const baseUrl = `${this.apiUrl}/draft_registrations/${draftId}/contributors/`;
    const type = data.id ? AddContributorType.Registered : AddContributorType.Unregistered;

    const contributorData = { data: ContributorsMapper.toContributorAddRequest(data, type) };

    return this.jsonApiService
      .post<ContributorResponse>(baseUrl, contributorData)
      .pipe(map((contributor) => ContributorsMapper.fromContributorResponse(contributor)));
  }

  updateContributor(draftId: string, data: ContributorModel): Observable<ContributorModel> {
    const baseUrl = `${environment.apiUrl}/draft_registrations/${draftId}/contributors/${data.userId}`;

    const contributorData = { data: ContributorsMapper.toContributorAddRequest(data) };

    return this.jsonApiService
      .patch<ContributorResponse>(baseUrl, contributorData)
      .pipe(map((contributor) => ContributorsMapper.fromContributorResponse(contributor)));
  }

  deleteContributor(draftId: string, contributorId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/draft_registrations/${draftId}/contributors/${contributorId}`);
  }
}
