import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { JsonApiService } from '@shared/services';

import {
  mapIndexCardResults,
  mapInstitutionDepartments,
  mapInstitutionSummaryMetrics,
  mapInstitutionUsers,
  sendMessageRequestMapper,
} from '../mappers';
import { requestProjectAccessMapper } from '../mappers/request-access.mapper';
import {
  InstitutionDepartment,
  InstitutionDepartmentsJsonApi,
  InstitutionIndexValueSearchJsonApi,
  InstitutionSearchFilter,
  InstitutionSummaryMetrics,
  InstitutionSummaryMetricsJsonApi,
  InstitutionUser,
  InstitutionUsersJsonApi,
  RequestProjectAccessData,
  SendMessageRequest,
  SendMessageResponseJsonApi,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class InstitutionsAdminService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  get shareTroveUrl() {
    return this.environment.shareTroveUrl;
  }

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

  fetchIndexValueSearch(
    institutionIris: string[],
    valueSearchPropertyPath: string,
    additionalParams?: Record<string, string>
  ): Observable<InstitutionSearchFilter[]> {
    const params: Record<string, string> = {
      'cardSearchFilter[affiliation]': institutionIris.join(','),
      valueSearchPropertyPath,
      'page[size]': '10',
      ...additionalParams,
    };

    return this.jsonApiService
      .get<InstitutionIndexValueSearchJsonApi>(`${this.shareTroveUrl}/index-value-search`, params)
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
}
