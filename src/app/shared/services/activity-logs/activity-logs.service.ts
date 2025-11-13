import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ActivityLogsMapper } from '@osf/shared/mappers/activity-logs.mapper';
import { ActivityLogWithDisplay } from '@osf/shared/models/activity-logs/activity-log-with-display.model';
import { ActivityLog } from '@osf/shared/models/activity-logs/activity-logs.model';
import { ActivityLogJsonApi } from '@osf/shared/models/activity-logs/activity-logs-json-api.model';
import { JsonApiResponseWithMeta, MetaAnonymousJsonApi } from '@osf/shared/models/common/json-api.model';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';

import { JsonApiService } from '../json-api.service';

import { ActivityLogDisplayService } from './activity-log-display.service';

@Injectable({ providedIn: 'root' })
export class ActivityLogsService {
  private jsonApiService = inject(JsonApiService);
  private display = inject(ActivityLogDisplayService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly apiUrl = `${this.environment.apiDomainUrl}/v2`;

  private formatActivities(result: PaginatedData<ActivityLog[]>): PaginatedData<ActivityLogWithDisplay[]> {
    return {
      ...result,
      data: result.data.map((log) => ({
        ...log,
        formattedActivity: this.display.getActivityDisplay(log),
      })),
    };
  }

  fetchLogs(projectId: string, page = 1, pageSize: number): Observable<PaginatedData<ActivityLogWithDisplay[]>> {
    const url = `${this.apiUrl}/nodes/${projectId}/logs/`;
    const params: Record<string, unknown> = {
      'embed[]': ['original_node', 'user', 'linked_node', 'linked_registration', 'template_node'],
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
    page = 1,
    pageSize: number
  ): Observable<PaginatedData<ActivityLogWithDisplay[]>> {
    const url = `${this.apiUrl}/registrations/${registrationId}/logs/`;
    const params: Record<string, unknown> = {
      'embed[]': ['original_node', 'user', 'linked_node', 'linked_registration', 'template_node'],
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
