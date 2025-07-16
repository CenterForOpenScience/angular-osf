import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { ApiData, JsonApiResponse, JsonApiResponseWithPaging } from '@osf/core/models';
import { preprintSortFieldMap } from '@osf/features/preprints/constants';
import { PreprintsMapper } from '@osf/features/preprints/mappers';
import {
  Preprint,
  PreprintAttributesJsonApi,
  PreprintEmbedsJsonApi,
  PreprintRelationshipsJsonApi,
} from '@osf/features/preprints/models';
import { SearchFilters } from '@shared/models';
import { searchPreferencesToJsonApiQueryParams } from '@shared/utils';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PreprintsService {
  private jsonApiService = inject(JsonApiService);

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
        JsonApiResponse<ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, null>, null>
      >(`${environment.apiUrl}/preprints/`, payload)
      .pipe(
        map((response) => {
          return PreprintsMapper.fromPreprintJsonApi(response.data);
        })
      );
  }

  getById(id: string) {
    return this.jsonApiService
      .get<
        JsonApiResponse<ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, null>, null>
      >(`${environment.apiUrl}/preprints/${id}/`)
      .pipe(
        map((response) => {
          return PreprintsMapper.fromPreprintJsonApi(response.data);
        })
      );
  }

  deletePreprint(id: string) {
    return this.jsonApiService.delete(`${environment.apiUrl}/preprints/${id}/`);
  }

  updatePreprint(id: string, payload: Partial<Preprint>): Observable<Preprint> {
    const apiPayload = this.mapPreprintDomainToApiPayload(payload);

    return this.jsonApiService
      .patch<ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, null>>(
        `${environment.apiUrl}/preprints/${id}/`,
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
    const payload = PreprintsMapper.toSubmitPreprintPayload(preprintId);
    return this.jsonApiService.post(`${environment.apiUrl}/preprints/${preprintId}/review_actions/`, payload);
  }

  createNewVersion(prevVersionPreprintId: string) {
    return this.jsonApiService
      .post<
        JsonApiResponse<ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, null>, null>
      >(`${environment.apiUrl}/preprints/${prevVersionPreprintId}/versions/?version=2.20`)
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

  getMyPreprints(pageNumber: number, pageSize: number, filters: SearchFilters) {
    const params: Record<string, unknown> = {
      'embed[]': ['bibliographic_contributors'],
      'fields[users]': 'family_name,full_name,given_name,middle_name',
      'fields[preprints]': 'title,date_modified,public,bibliographic_contributors',
    };

    searchPreferencesToJsonApiQueryParams(params, pageNumber, pageSize, filters, preprintSortFieldMap);

    return this.jsonApiService
      .get<
        JsonApiResponseWithPaging<ApiData<PreprintAttributesJsonApi, PreprintEmbedsJsonApi, null, null>[], null>
      >(`${environment.apiUrl}/users/me/preprints/`, params)
      .pipe(map((response) => PreprintsMapper.fromMyPreprintJsonApi(response)));
  }
}
