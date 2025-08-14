import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { mapInstitutionPreprints } from '@osf/features/admin-institutions/mappers/institution-preprints.mapper';
import { JsonApiService } from '@shared/services';

import {
  mapIndexCardResults,
  mapInstitutionDepartments,
  mapInstitutionProjects,
  mapInstitutionRegistrations,
  mapInstitutionSummaryMetrics,
  mapInstitutionUsers,
  sendMessageRequestMapper,
} from '../mappers';
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

  fetchProjects(institutionId: string, iris: string[], pageSize = 10, sort = '-dateModified', cursor = '') {
    return this.fetchIndexCards('Project', iris, pageSize, sort, cursor);
  }

  fetchRegistrations(institutionId: string, iris: string[], pageSize = 10, sort = '-dateModified', cursor = '') {
    return this.fetchIndexCards('Registration', iris, pageSize, sort, cursor);
  }

  fetchPreprints(institutionId: string, iris: string[], pageSize = 10, sort = '-dateModified', cursor = '') {
    return this.fetchIndexCards('Preprint', iris, pageSize, sort, cursor);
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

  private fetchIndexCards(
    resourceType: 'Project' | 'Registration' | 'Preprint',
    institutionIris: string[],
    pageSize = 10,
    sort = '-dateModified',
    cursor = ''
  ): Observable<AdminInstitutionSearchResult> {
    const url = `${environment.shareDomainUrl}/index-card-search`;
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
          case 'Registration':
            mapper = mapInstitutionRegistrations;
            break;
          case 'Project':
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
