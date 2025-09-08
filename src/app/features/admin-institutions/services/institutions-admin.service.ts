import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@shared/services';

import { SearchResourceType } from '../enums';
import {
  mapIndexCardResults,
  mapInstitutionDepartments,
  mapInstitutionPreprints,
  mapInstitutionProjects,
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
  InstitutionProject,
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
  private readonly jsonApiService = inject(JsonApiService);
  private readonly apiUrl = `${environment.apiDomainUrl}/v2`;

  fetchDepartments(institutionId: string): Observable<InstitutionDepartment[]> {
    return this.jsonApiService
      .get<InstitutionDepartmentsJsonApi>(`${this.apiUrl}/institutions/${institutionId}/metrics/departments/`)
      .pipe(map((res) => mapInstitutionDepartments(res)));
  }

  fetchSummary(institutionId: string): Observable<InstitutionSummaryMetrics> {
    return this.jsonApiService
      .get<InstitutionSummaryMetricsJsonApi>(`${this.apiUrl}/institutions/${institutionId}/metrics/summary/`)
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
      .get<InstitutionUsersJsonApi>(`${this.apiUrl}/institutions/${institutionId}/metrics/users/`, params)
      .pipe(
        map((response) => ({
          users: mapInstitutionUsers(response as InstitutionUsersJsonApi),
          totalCount: response.meta.total,
        }))
      );
  }

  fetchProjects(iris: string[], pageSize = 10, sort = '-dateModified', cursor = '') {
    return this.fetchIndexCards(SearchResourceType.Project, iris, pageSize, sort, cursor);
  }

  fetchRegistrations(iris: string[], pageSize = 10, sort = '-dateModified', cursor = '') {
    return this.fetchIndexCards(SearchResourceType.Registration, iris, pageSize, sort, cursor);
  }

  fetchPreprints(iris: string[], pageSize = 10, sort = '-dateModified', cursor = '') {
    return this.fetchIndexCards(SearchResourceType.Preprint, iris, pageSize, sort, cursor);
  }

  fetchIndexValueSearch(
    institutionId: string,
    valueSearchPropertyPath: string,
    additionalParams?: Record<string, string>
  ): Observable<InstitutionSearchFilter[]> {
    const params: Record<string, string> = {
      'cardSearchFilter[affiliation]': `https://ror.org/05d5mza29,${environment.webUrl}/institutions/${institutionId}/`,
      valueSearchPropertyPath,
      'page[size]': '10',
      ...additionalParams,
    };

    return this.jsonApiService
      .get<InstitutionIndexValueSearchJsonApi>(`${environment.shareTroveUrl}/index-value-search`, params)
      .pipe(map((response) => mapIndexCardResults(response?.included)));
  }

  sendMessage(request: SendMessageRequest): Observable<SendMessageResponseJsonApi> {
    const payload = sendMessageRequestMapper(request);

    return this.jsonApiService.post<SendMessageResponseJsonApi>(
      `${this.apiUrl}/users/${request.userId}/messages/`,
      payload
    );
  }

  requestProjectAccess(request: RequestProjectAccessData): Observable<void> {
    const payload = requestProjectAccessMapper(request);

    return this.jsonApiService.post<void>(`${this.apiUrl}/nodes/${request.projectId}/requests/`, payload);
  }

  private fetchIndexCards(
    resourceType: SearchResourceType,
    institutionIris: string[],
    pageSize = 10,
    sort = '-dateModified',
    cursor = ''
  ): Observable<AdminInstitutionSearchResult> {
    const url = `${environment.shareTroveUrl}/index-card-search`;
    const affiliationParam = institutionIris.join(',');

    const params: Record<string, string> = {
      'cardSearchFilter[affiliation][]': affiliationParam,
      'cardSearchFilter[resourceType]': resourceType,
      'cardSearchFilter[accessService]': environment.webUrl,
      'page[cursor]': cursor,
      'page[size]': pageSize.toString(),
      sort,
    };

    return this.jsonApiService.get<InstitutionRegistrationsJsonApi>(url, params).pipe(
      map((res) => {
        let mapper: (
          response: InstitutionRegistrationsJsonApi
        ) => InstitutionProject[] | InstitutionRegistration[] | InstitutionPreprint[];
        switch (resourceType) {
          case SearchResourceType.Registration:
            mapper = mapInstitutionRegistrations;
            break;
          case SearchResourceType.Project:
            mapper = mapInstitutionProjects;
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
