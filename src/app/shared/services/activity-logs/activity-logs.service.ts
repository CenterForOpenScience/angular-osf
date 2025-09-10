import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ActivityLogsMapper } from '@shared/mappers/activity-logs.mapper';
import {
  ActivityLog,
  ActivityLogJsonApi,
  JsonApiResponseWithMeta,
  MetaAnonymousJsonApi,
  PaginatedData,
} from '@shared/models';
import { JsonApiService } from '@shared/services/json-api.service';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogsService {
  private jsonApiService = inject(JsonApiService);
  private apiUrl = `${environment.apiDomainUrl}/v2`;

  fetchLogs(projectId: string, page = '1', pageSize: string): Observable<PaginatedData<ActivityLog[]>> {
    const url = `${this.apiUrl}/nodes/${projectId}/logs/`;
    const params: Record<string, unknown> = {
      'embed[]': ['original_node', 'user', 'linked_node', 'linked_registration', 'template_node', 'group'],
      page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<JsonApiResponseWithMeta<ActivityLogJsonApi[], MetaAnonymousJsonApi, null>>(url, params)
      .pipe(map((res) => ActivityLogsMapper.fromGetActivityLogsResponse(res)));
  }

  fetchRegistrationLogs(
    registrationId: string,
    page = '1',
    pageSize: string
  ): Observable<PaginatedData<ActivityLog[]>> {
    const url = `${environment.apiUrl}/registrations/${registrationId}/logs/`;
    const params: Record<string, unknown> = {
      'embed[]': ['original_node', 'user', 'linked_node', 'linked_registration', 'template_node', 'group'],
      page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<ResponseJsonApi<ActivityLogJsonApi[]>>(url, params)
      .pipe(map((res) => ActivityLogsMapper.fromGetActivityLogsResponse(res)));
  }
}
