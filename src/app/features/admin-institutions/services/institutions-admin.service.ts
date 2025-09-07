import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ResourceType } from '@shared/enums';
import { getResourceTypeStringFromEnum } from '@shared/helpers';
import { JsonApiService } from '@shared/services';

import {
  mapIndexCardResults,
  mapInstitutionDepartments,
  mapInstitutionPreprints,
  mapInstitutionRegistrations,
  mapInstitutionSummaryMetrics,
  mapInstitutionUsers,
  sendMessageRequestMapper,
} from '../mappers';
import { requestProjectAccessMapper } from '../mappers/request-access.mapper';
import {
  AdminInstitutionSearchResult,
  InstitutionDepartment,
  InstitutionDepartmentsJsonApi,
  InstitutionIndexValueSearchJsonApi,
  InstitutionPreprint,
  InstitutionRegistration,
  InstitutionRegistrationsJsonApi,
  InstitutionSearchFilter,
  InstitutionSummaryMetrics,
  InstitutionSummaryMetricsJsonApi,
  InstitutionUser,
  InstitutionUsersJsonApi,
  RequestProjectAccessData,
  SendMessageRequest,
  SendMessageResponseJsonApi,
} from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InstitutionsAdminService {
  private jsonApiService = inject(JsonApiService);

  fetchDepartments(institutionId: string): Observable<InstitutionDepartment[]> {
    return this.jsonApiService
      .get<InstitutionDepartmentsJsonApi>(`${environment.apiUrl}/institutions/${institutionId}/metrics/departments/`)
      .pipe(map((res) => mapInstitutionDepartments(res)));
  }

  fetchSummary(institutionId: string): Observable<InstitutionSummaryMetrics> {
    return this.jsonApiService
      .get<InstitutionSummaryMetricsJsonApi>(`${environment.apiUrl}/institutions/${institutionId}/metrics/summary/`)
      .pipe(map((result) => mapInstitutionSummaryMetrics(result.data.attributes)));
  }

  fetchUsers(
    institutionId: string,
    page = 1,
    pageSize = 10,
    sort = 'user_name',
    filters?: Record<string, string>
  ): Observable<{ users: InstitutionUser[]; totalCount: number }> {
    const params: Record<string, string> = {
      page: page.toString(),
      'page[size]': pageSize.toString(),
      sort,
      ...filters,
    };

    return this.jsonApiService
      .get<InstitutionUsersJsonApi>(`${environment.apiUrl}/institutions/${institutionId}/metrics/users/`, params)
      .pipe(
        map((response) => ({
          users: mapInstitutionUsers(response as InstitutionUsersJsonApi),
          totalCount: response.meta.total,
        }))
      );
  }

  fetchRegistrations(iris: string[], sort = '-dateModified', cursor = '') {
    return this.fetchIndexCards(ResourceType.Registration, iris, sort, cursor);
  }

  fetchPreprints(iris: string[], sort = '-dateModified', cursor = '') {
    return this.fetchIndexCards(ResourceType.Preprint, iris, sort, cursor);
  }

  fetchIndexValueSearch(
    institutionId: string,
    valueSearchPropertyPath: string,
    additionalParams?: Record<string, string>
  ): Observable<InstitutionSearchFilter[]> {
    //TODO fix iris
    const params: Record<string, string> = {
      'cardSearchFilter[affiliation]': `https://ror.org/05d5mza29,${environment.webUrl}/institutions/${institutionId}/`,
      valueSearchPropertyPath,
      'page[size]': '10',
      ...additionalParams,
    };

    return this.jsonApiService
      .get<InstitutionIndexValueSearchJsonApi>(`${environment.shareDomainUrl}/index-value-search`, params)
      .pipe(map((response) => mapIndexCardResults(response?.included)));
  }

  sendMessage(request: SendMessageRequest): Observable<SendMessageResponseJsonApi> {
    const payload = sendMessageRequestMapper(request);

    return this.jsonApiService.post<SendMessageResponseJsonApi>(
      `${environment.apiUrl}/users/${request.userId}/messages/`,
      payload
    );
  }

  requestProjectAccess(request: RequestProjectAccessData): Observable<void> {
    const payload = requestProjectAccessMapper(request);

    return this.jsonApiService.post<void>(`${environment.apiUrl}/nodes/${request.projectId}/requests/`, payload);
  }

  private fetchIndexCards(
    resourceType: ResourceType,
    institutionIris: string[],
    sort = '-dateModified',
    cursor = ''
  ): Observable<AdminInstitutionSearchResult> {
    const url = `${environment.shareDomainUrl}/index-card-search`;
    const affiliationParam = institutionIris.join(',');

    const sortParam = sort.includes('date') ? 'sort' : 'sort[integer-value]';

    const params: Record<string, string> = {
      'cardSearchFilter[affiliation][]': affiliationParam,
      'cardSearchFilter[resourceType]': getResourceTypeStringFromEnum(resourceType),
      'cardSearchFilter[accessService]': environment.webUrl,
      'page[cursor]': cursor,
      'page[size]': '10',
      [sortParam]: sort,
    };

    return this.jsonApiService.get<InstitutionRegistrationsJsonApi>(url, params).pipe(
      map((res) => {
        let mapper: (response: InstitutionRegistrationsJsonApi) => InstitutionRegistration[] | InstitutionPreprint[];
        switch (resourceType) {
          case ResourceType.Registration:
            mapper = mapInstitutionRegistrations;
            break;
          default:
            mapper = mapInstitutionPreprints;
            break;
        }

        return {
          items: mapper(res),
          totalCount: res.data.attributes.totalResultCount,
          links: res.data.relationships.searchResultPage.links,
          downloadLink: res.data.links.self || null,
        };
      })
    );
  }
}
