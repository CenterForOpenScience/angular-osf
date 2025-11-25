import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { RegistryModerationMapper } from '@osf/features/moderation/mappers';
import { ReviewAction, ReviewActionsResponseJsonApi } from '@osf/features/moderation/models';
import { IdentifiersMapper } from '@osf/shared/mappers/identifiers.mapper';
import { InstitutionsMapper } from '@osf/shared/mappers/institutions';
import { LicensesMapper } from '@osf/shared/mappers/licenses.mapper';
import { PageSchemaMapper, RegistrationMapper } from '@osf/shared/mappers/registration';
import { ReviewActionsMapper } from '@osf/shared/mappers/review-actions.mapper';
import { IdentifierModel } from '@osf/shared/models/identifiers/identifier.model';
import { IdentifiersResponseJsonApi } from '@osf/shared/models/identifiers/identifier-json-api.model';
import { InstitutionsJsonApiResponse } from '@osf/shared/models/institutions/institution-json-api.model';
import { Institution } from '@osf/shared/models/institutions/institutions.models';
import { LicenseModel } from '@osf/shared/models/license/license.model';
import { LicenseResponseJsonApi } from '@osf/shared/models/license/licenses-json-api.model';
import { PageSchema } from '@osf/shared/models/registration/page-schema.model';
import {
  SchemaResponseJsonApi,
  SchemaResponsesJsonApi,
} from '@osf/shared/models/registration/registration-json-api.model';
import { SchemaBlocksResponseJsonApi } from '@osf/shared/models/registration/schema-blocks-json-api.model';
import { SchemaResponse } from '@osf/shared/models/registration/schema-response.model';
import { ReviewActionPayload } from '@osf/shared/models/review-action/review-action-payload.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

import { MapRegistrationOverview } from '../mappers';
import {
  RegistrationOverviewDataJsonApi,
  RegistrationOverviewModel,
  RegistrationOverviewResponse,
  RegistryOverviewWithMeta,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class RegistryOverviewService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getRegistrationById(id: string): Observable<RegistryOverviewWithMeta> {
    return this.jsonApiService
      .get<RegistrationOverviewResponse>(`${this.apiUrl}/registrations/${id}/`)
      .pipe(map((response) => ({ registry: MapRegistrationOverview(response.data), meta: response.meta })));
  }

  getInstitutions(registryId: string): Observable<Institution[]> {
    const params = { 'page[size]': 100 };

    return this.jsonApiService
      .get<InstitutionsJsonApiResponse>(`${this.apiUrl}/registrations/${registryId}/institutions/`, params)
      .pipe(map((response) => InstitutionsMapper.fromInstitutionsResponse(response)));
  }

  getRegistryIdentifiers(registryId: string): Observable<IdentifierModel[]> {
    return this.jsonApiService
      .get<IdentifiersResponseJsonApi>(`${this.apiUrl}/registrations/${registryId}/identifiers/`)
      .pipe(map((response) => IdentifiersMapper.fromJsonApi(response)));
  }

  getRegistryLicense(licenseId: string): Observable<LicenseModel | null> {
    return this.jsonApiService
      .get<LicenseResponseJsonApi>(`${this.apiUrl}/licenses/${licenseId}/`)
      .pipe(map((response) => LicensesMapper.fromLicenseDataJsonApi(response.data)));
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

  getSchemaResponses(registryId: string): Observable<SchemaResponse[]> {
    return this.jsonApiService
      .get<SchemaResponsesJsonApi>(`${this.apiUrl}/registrations/${registryId}/schema_responses/`)
      .pipe(map((response) => response.data.map((item) => RegistrationMapper.fromSchemaResponse(item))));
  }

  getRegistryReviewActions(id: string): Observable<ReviewAction[]> {
    const baseUrl = `${this.apiUrl}/registrations/${id}/actions/`;

    return this.jsonApiService
      .get<ReviewActionsResponseJsonApi>(baseUrl)
      .pipe(map((response) => response.data.map((x) => RegistryModerationMapper.fromActionResponse(x))));
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

    return this.jsonApiService
      .post<SchemaResponseJsonApi>(`${this.apiUrl}/schema_responses/`, payload)
      .pipe(map((response) => RegistrationMapper.fromSchemaResponse(response.data)));
  }

  withdrawRegistration(registryId: string, justification: string): Observable<RegistrationOverviewModel> {
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
      .patch<RegistrationOverviewDataJsonApi>(`${this.apiUrl}/registrations/${registryId}/`, payload)
      .pipe(map((response) => MapRegistrationOverview(response)));
  }

  makePublic(registryId: string): Observable<RegistrationOverviewModel> {
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
      .patch<RegistrationOverviewDataJsonApi>(`${this.apiUrl}/registrations/${registryId}/`, payload)
      .pipe(map((response) => MapRegistrationOverview(response)));
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
