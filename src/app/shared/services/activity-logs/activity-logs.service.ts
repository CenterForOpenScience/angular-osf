import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { ActivityLogsMapper } from '@shared/mappers/activity-logs.mapper';
import {
  ActivityLog,
  ActivityLogJsonApi,
  JsonApiResponseWithMeta,
  MetaAnonymousJsonApi,
  PaginatedData,
} from '@shared/models';
import { ActivityLogDisplayService } from '@shared/services';
import { JsonApiService } from '@shared/services/json-api.service';

import { environment } from 'src/environments/environment';

type ActivityLogWithDisplay = ActivityLog & { formattedActivity?: SafeHtml };

@Injectable({
  providedIn: 'root',
})
export class ActivityLogsService {
  private jsonApiService = inject(JsonApiService);
  private display = inject(ActivityLogDisplayService);
  private apiUrl = `${environment.apiDomainUrl}/v2`;

  private formatActivities(result: PaginatedData<ActivityLog[]>): PaginatedData<ActivityLogWithDisplay[]> {
    return {
      ...result,
      data: result.data.map((log) => ({
        ...log,
        formattedActivity: this.display.getActivityDisplay(log),
      })),
    };
  }

  fetchLogs(projectId: string, page: number = 1, pageSize: number): Observable<PaginatedData<ActivityLogWithDisplay[]>> {
    const url = `${this.apiUrl}/nodes/${projectId}/logs/`;
    const params: Record<string, unknown> = {
      'embed[]': ['original_node', 'user', 'linked_node', 'linked_registration', 'template_node', 'group'],
      page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<JsonApiResponseWithMeta<ActivityLogJsonApi[], MetaAnonymousJsonApi, null>>(url, params)
      .pipe(
        map((res) => ActivityLogsMapper.fromGetActivityLogsResponse(res)),
        map((mapped) => this.formatActivities(mapped))
      );
  }

  fetchRegistrationLogs(
    registrationId: string,
    page: number = 1,
    pageSize: number
  ): Observable<PaginatedData<ActivityLogWithDisplay[]>> {
    const url = `${environment.apiUrl}/registrations/${registrationId}/logs/`;
    const params: Record<string, unknown> = {
      'embed[]': ['original_node', 'user', 'linked_node', 'linked_registration', 'template_node', 'group'],
      page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<JsonApiResponseWithMeta<ActivityLogJsonApi[], MetaAnonymousJsonApi, null>>(url, params)
      .pipe(
        map((res) => ActivityLogsMapper.fromGetActivityLogsResponse(res)),
        map((mapped) => this.formatActivities(mapped))
      );
  }
}
