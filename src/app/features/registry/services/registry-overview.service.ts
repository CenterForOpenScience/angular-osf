import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { RegistryModerationMapper } from '@osf/features/moderation/mappers';
import { ReviewAction, ReviewActionsResponseJsonApi } from '@osf/features/moderation/models';
import { MapRegistryOverview } from '@osf/features/registry/mappers';
import {
  GetRegistryOverviewJsonApi,
  RegistryOverview,
  RegistryOverviewJsonApiData,
  RegistryOverviewWithMeta,
} from '@osf/features/registry/models';
import { InstitutionsMapper, ReviewActionsMapper } from '@osf/shared/mappers';
import { PageSchemaMapper } from '@osf/shared/mappers/registration';
import { Institution, InstitutionsJsonApiResponse, PageSchema, SchemaBlocksResponseJsonApi } from '@osf/shared/models';
import { ReviewActionPayload } from '@osf/shared/models/review-action';
import { JsonApiService } from '@shared/services';

@Injectable({
  providedIn: 'root',
})
export class RegistryOverviewService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly apiUrl = `${this.environment.apiDomainUrl}/v2`;

  getRegistrationById(id: string): Observable<RegistryOverviewWithMeta> {
    const params = {
      related_counts: 'forks,linked_nodes,linked_registrations,children,wikis',
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
      .get<GetRegistryOverviewJsonApi>(`${this.apiUrl}/registrations/${id}/`, params)
      .pipe(map((response) => ({ registry: MapRegistryOverview(response.data), meta: response.meta })));
  }

  getInstitutions(registryId: string): Observable<Institution[]> {
    const params = {
      'page[size]': 100,
    };

    return this.jsonApiService
      .get<InstitutionsJsonApiResponse>(`${this.apiUrl}/registrations/${registryId}/institutions/`, params)
      .pipe(map((response) => InstitutionsMapper.fromInstitutionsResponse(response)));
  }

  getSchemaBlocks(schemaLink: string): Observable<PageSchema[]> {
    const params = {
      'page[size]': 200,
      page: 1,
    };

    let fullUrl: string;
    if (schemaLink.includes('?')) {
      const [baseUrl, queryString] = schemaLink.split('?');
      fullUrl = `${baseUrl}schema_blocks/?${queryString}`;
    } else {
      fullUrl = `${schemaLink}schema_blocks/`;
    }

    return this.jsonApiService
      .get<SchemaBlocksResponseJsonApi>(fullUrl, params)
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
      .patch<RegistryOverviewJsonApiData>(`${this.apiUrl}/registrations/${registryId}`, payload)
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
      .patch<RegistryOverviewJsonApiData>(`${this.apiUrl}/registrations/${registryId}`, payload)
      .pipe(map((response) => MapRegistryOverview(response)));
  }

  getRegistryReviewActions(id: string): Observable<ReviewAction[]> {
    const baseUrl = `${this.apiUrl}/registrations/${id}/actions/`;

    return this.jsonApiService
      .get<ReviewActionsResponseJsonApi>(baseUrl)
      .pipe(map((response) => response.data.map((x) => RegistryModerationMapper.fromActionResponse(x))));
  }

  submitDecision(payload: ReviewActionPayload, isRevision: boolean): Observable<void> {
    const path = isRevision ? 'schema_responses' : 'registrations';
    const baseUrl = `${this.apiUrl}/${path}/${payload.targetId}/actions/`;

    const actionType = isRevision ? 'schema_response_actions' : 'review_actions';
    const targetType = isRevision ? 'schema-responses' : 'registrations';

    const params = ReviewActionsMapper.toReviewActionPayloadJsonApi(payload, actionType, targetType);
    return this.jsonApiService.post<void>(`${baseUrl}`, params);
  }
}
