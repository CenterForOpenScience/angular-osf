import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { RegistryModerationMapper } from '@osf/features/moderation/mappers';
import { ReviewActionsResponseJsonApi } from '@osf/features/moderation/models';
import { PreprintRequestActionsMapper } from '@osf/features/preprints/mappers/preprint-request-actions.mapper';
import { PreprintRequestAction } from '@osf/features/preprints/models/preprint-request-action.models';
import { searchPreferencesToJsonApiQueryParams, StringOrNull } from '@osf/shared/helpers';
import { ApiData, JsonApiResponse, JsonApiResponseWithMeta, ResponseJsonApi, SearchFilters } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { preprintSortFieldMap } from '../constants';
import { PreprintRequestMapper, PreprintsMapper } from '../mappers';
import {
  Preprint,
  PreprintAttributesJsonApi,
  PreprintEmbedsJsonApi,
  PreprintLinksJsonApi,
  PreprintMetaJsonApi,
  PreprintRelationshipsJsonApi,
  PreprintRequest,
  PreprintRequestActionsJsonApiResponse,
  PreprintRequestsJsonApiResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class PreprintsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  private domainToApiFieldMap: Record<string, string> = {
    title: 'title',
    description: 'description',
    originalPublicationDate: 'original_publication_date',
    doi: 'doi',
    customPublicationCitation: 'custom_publication_citation',
    tags: 'tags',
    hasCoi: 'has_coi',
    coiStatement: 'conflict_of_interest_statement',
    hasDataLinks: 'has_data_links',
    dataLinks: 'data_links',
    whyNoData: 'why_no_data',
    hasPreregLinks: 'has_prereg_links',
    preregLinks: 'prereg_links',
    whyNoPrereg: 'why_no_prereg',
    preregLinkInfo: 'prereg_link_info',
  };

  createPreprint(title: string, abstract: string, providerId: string) {
    const payload = PreprintsMapper.toCreatePayload(title, abstract, providerId);
    return this.jsonApiService
      .post<
        JsonApiResponse<
          ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, PreprintLinksJsonApi>,
          null
        >
      >(`${this.apiUrl}/preprints/`, payload)
      .pipe(map((response) => PreprintsMapper.fromPreprintJsonApi(response.data)));
  }

  getById(id: string) {
    return this.jsonApiService
      .get<
        JsonApiResponse<
          ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, PreprintLinksJsonApi>,
          null
        >
      >(`${this.apiUrl}/preprints/${id}/`)
      .pipe(map((response) => PreprintsMapper.fromPreprintJsonApi(response.data)));
  }

  getByIdWithEmbeds(id: string) {
    const params = {
      'metrics[views]': 'total',
      'metrics[downloads]': 'total',
      'embed[]': ['license', 'identifiers'],
    };
    return this.jsonApiService
      .get<
        JsonApiResponseWithMeta<
          ApiData<PreprintAttributesJsonApi, PreprintEmbedsJsonApi, PreprintRelationshipsJsonApi, PreprintLinksJsonApi>,
          PreprintMetaJsonApi,
          null
        >
      >(`${this.apiUrl}/preprints/${id}/`, params)
      .pipe(map((response) => PreprintsMapper.fromPreprintWithEmbedsJsonApi(response)));
  }

  deletePreprint(id: string) {
    return this.jsonApiService.delete(`${this.apiUrl}/preprints/${id}/`);
  }

  updatePreprint(id: string, payload: Partial<Preprint>): Observable<Preprint> {
    const apiPayload = this.mapPreprintDomainToApiPayload(payload);

    return this.jsonApiService
      .patch<ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, PreprintLinksJsonApi>>(
        `${this.apiUrl}/preprints/${id}/`,
        {
          data: {
            type: 'preprints',
            id,
            attributes: apiPayload,
          },
        }
      )
      .pipe(map((response) => PreprintsMapper.fromPreprintJsonApi(response)));
  }

  submitPreprint(preprintId: string) {
    const payload = PreprintsMapper.toReviewActionPayload(preprintId, 'submit');
    return this.jsonApiService.post(`${this.apiUrl}/preprints/${preprintId}/review_actions/`, payload);
  }

  createNewVersion(prevVersionPreprintId: string) {
    return this.jsonApiService
      .post<
        JsonApiResponse<
          ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, PreprintLinksJsonApi>,
          null
        >
      >(`${this.apiUrl}/preprints/${prevVersionPreprintId}/versions/?version=2.20`)
      .pipe(map((response) => PreprintsMapper.fromPreprintJsonApi(response.data)));
  }

  private mapPreprintDomainToApiPayload(domainPayload: Partial<Preprint>): Partial<PreprintAttributesJsonApi> {
    const apiPayload: Record<string, unknown> = {};
    Object.entries(domainPayload).forEach(([key, value]) => {
      if (value !== undefined && this.domainToApiFieldMap[key]) {
        apiPayload[this.domainToApiFieldMap[key]] = value;
      }
    });
    return apiPayload;
  }

  getPreprintVersionIds(preprintId: string): Observable<string[]> {
    return this.jsonApiService
      .get<
        ResponseJsonApi<ApiData<PreprintAttributesJsonApi, null, null, null>[]>
      >(`${this.apiUrl}/preprints/${preprintId}/versions/`)
      .pipe(map((response) => response.data.map((data) => data.id)));
  }

  getMyPreprints(pageNumber: number, pageSize: number, filters: SearchFilters) {
    const params: Record<string, unknown> = {
      'embed[]': ['bibliographic_contributors'],
      'fields[users]': 'family_name,full_name,given_name,middle_name',
      'fields[preprints]': 'title,date_modified,public,bibliographic_contributors,provider',
    };

    searchPreferencesToJsonApiQueryParams(params, pageNumber, pageSize, filters, preprintSortFieldMap);

    return this.jsonApiService
      .get<
        ResponseJsonApi<ApiData<PreprintAttributesJsonApi, PreprintEmbedsJsonApi, PreprintRelationshipsJsonApi, null>[]>
      >(`${this.apiUrl}/users/me/preprints/`, params)
      .pipe(map((response) => PreprintsMapper.fromMyPreprintJsonApi(response)));
  }

  getPreprintReviewActions(preprintId: string) {
    const baseUrl = `${this.apiUrl}/preprints/${preprintId}/review_actions/`;

    return this.jsonApiService
      .get<ReviewActionsResponseJsonApi>(baseUrl)
      .pipe(map((response) => response.data.map((x) => RegistryModerationMapper.fromActionResponse(x))));
  }

  getPreprintRequests(preprintId: string): Observable<PreprintRequest[]> {
    const baseUrl = `${this.apiUrl}/preprints/${preprintId}/requests/?embed=creator`;

    return this.jsonApiService
      .get<PreprintRequestsJsonApiResponse>(baseUrl)
      .pipe(map((response) => response.data.map((x) => PreprintRequestMapper.fromPreprintRequest(x))));
  }

  getPreprintRequestActions(requestId: string): Observable<PreprintRequestAction[]> {
    const baseUrl = `${this.apiUrl}/requests/${requestId}/actions/`;

    return this.jsonApiService
      .get<PreprintRequestActionsJsonApiResponse>(baseUrl)
      .pipe(map((response) => response.data.map((x) => PreprintRequestActionsMapper.fromPreprintRequestActions(x))));
  }

  withdrawPreprint(preprintId: string, justification: string) {
    const payload = PreprintRequestMapper.toWithdrawPreprintPayload(preprintId, justification);

    return this.jsonApiService.post(`${this.apiUrl}/preprints/${preprintId}/requests/`, payload);
  }

  submitReviewsDecision(preprintId: string, trigger: string, comment: StringOrNull) {
    const payload = PreprintsMapper.toReviewActionPayload(preprintId, trigger, comment);
    return this.jsonApiService.post(`${this.apiUrl}/actions/reviews/`, payload);
  }

  submitRequestsDecision(requestId: string, trigger: string, comment: StringOrNull) {
    const payload = PreprintRequestActionsMapper.toRequestActionPayload(requestId, trigger, comment);
    return this.jsonApiService.post(`${this.apiUrl}/actions/requests/preprints/`, payload);
  }
}
