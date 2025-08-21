import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { RegistryModerationMapper } from '@osf/features/moderation/mappers';
import { ReviewAction, ReviewActionsResponseJsonApi } from '@osf/features/moderation/models';
import { MapRegistryOverview } from '@osf/features/registry/mappers';
import {
  GetRegistryOverviewJsonApi,
  GetResourceSubjectsJsonApi,
  RegistryOverview,
  RegistryOverviewJsonApiData,
  RegistrySubject,
} from '@osf/features/registry/models';
import { InstitutionsMapper, ReviewActionsMapper } from '@osf/shared/mappers';
import { PageSchemaMapper } from '@osf/shared/mappers/registration';
import { Institution, InstitutionsJsonApiResponse, PageSchema, SchemaBlocksResponseJsonApi } from '@osf/shared/models';
import { ReviewActionPayload } from '@osf/shared/models/review-action';
import { JsonApiService } from '@shared/services';

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
      .get<GetRegistryOverviewJsonApi>(`${environment.apiUrl}/registrations/${id}/`, params)
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

  getInstitutions(registryId: string): Observable<Institution[]> {
    const params = {
      'page[size]': 100,
    };

    return this.jsonApiService
      .get<InstitutionsJsonApiResponse>(`${environment.apiUrl}/registrations/${registryId}/institutions/`, params)
      .pipe(map((response) => InstitutionsMapper.fromInstitutionsResponse(response)));
  }

  getSchemaBlocks(schemaLink: string): Observable<PageSchema[]> {
    const params = {
      'page[size]': 200,
      page: 1,
    };

    return this.jsonApiService
      .get<SchemaBlocksResponseJsonApi>(`${schemaLink}schema_blocks/`, params)
      .pipe(map((response) => PageSchemaMapper.fromSchemaBlocksResponse(response)));
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

  getRegistryReviewActions(id: string): Observable<ReviewAction[]> {
    const baseUrl = `${environment.apiUrl}/registrations/${id}/actions/`;

    return this.jsonApiService
      .get<ReviewActionsResponseJsonApi>(baseUrl)
      .pipe(map((response) => response.data.map((x) => RegistryModerationMapper.fromActionResponse(x))));
  }

  submitDecision(payload: ReviewActionPayload, isRevision: boolean): Observable<void> {
    const path = isRevision ? 'schema_responses' : 'registrations';
    const baseUrl = `${environment.apiUrl}/${path}/${payload.targetId}/actions/`;

    const actionType = isRevision ? 'schema_response_actions' : 'review_actions';
    const targetType = isRevision ? 'schema-responses' : 'registrations';

    const params = ReviewActionsMapper.toReviewActionPayloadJsonApi(payload, actionType, targetType);
    return this.jsonApiService.post<void>(`${baseUrl}`, params);
  }
}
