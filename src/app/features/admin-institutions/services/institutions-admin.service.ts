import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { mapInstitutionPreprints } from '@osf/features/admin-institutions/mappers/institution-preprints.mapper';
import { departmens, summaryMetrics, users } from '@osf/features/admin-institutions/services/mock';
import { PaginationLinksModel } from '@shared/models';

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
  hardcodedUrl = 'https://api.test.osf.io/v2';

  private jsonApiService = inject(JsonApiService);

  fetchDepartments(institutionId: string): Observable<InstitutionDepartment[]> {
    return this.jsonApiService
      .get<InstitutionDepartmentsJsonApi>(`${this.hardcodedUrl}/institutions/${institutionId}/metrics/departments/`)
      .pipe(
        //TODO: remove mock data
        catchError(() => {
          return of(departmens as InstitutionDepartmentsJsonApi);
        }),
        map((res) => mapInstitutionDepartments(res))
      );
  }

  fetchSummary(institutionId: string): Observable<InstitutionSummaryMetrics> {
    return this.jsonApiService
      .get<InstitutionSummaryMetricsJsonApi>(`${this.hardcodedUrl}/institutions/${institutionId}/metrics/summary/`)
      .pipe(
        //TODO: remove mock data
        catchError(() => {
          return of(summaryMetrics as InstitutionSummaryMetricsJsonApi);
        }),
        map((result) => mapInstitutionSummaryMetrics(result.data.attributes))
      );
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
      .get<InstitutionUsersJsonApi>(`${this.hardcodedUrl}/institutions/${institutionId}/metrics/users/`, params)
      .pipe(
        //TODO: remove mock data
        catchError(() => {
          return of(users);
        }),
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
      //TODO: change here https://test.osf.io to current environment
      'cardSearchFilter[affiliation]': `https://ror.org/05d5mza29,https://test.osf.io/institutions/${institutionId}/`,
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

    return this.jsonApiService.post<SendMessageResponseJsonApi>(`${this.hardcodedUrl}/institutions/messages/`, payload);
  }

  private fetchIndexCards(
    resourceType: 'Project' | 'Registration' | 'Preprint',
    institutionIris: string[],
    pageSize = 10,
    sort = '-dateModified',
    cursor = ''
  ): Observable<{
    items: InstitutionProject[] | InstitutionRegistration[] | InstitutionPreprint[];
    totalCount: number;
    links?: PaginationLinksModel;
  }> {
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
        };
      })
    );
  }
}
