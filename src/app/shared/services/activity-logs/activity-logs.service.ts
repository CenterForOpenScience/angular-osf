import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { ActivityLogsMapper } from '@osf/shared/mappers/activity-logs.mapper';
import { ActivityLogWithDisplay } from '@osf/shared/models/activity-logs/activity-log-with-display.model';
import { ActivityLogJsonApi } from '@osf/shared/models/activity-logs/activity-logs-json-api.model';
import { ResponseJsonApi } from '@osf/shared/models/common/json-api.model';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';

import { JsonApiService } from '../json-api.service';

import { ActivityLogDisplayService } from './activity-log-display.service';

@Injectable({ providedIn: 'root' })
export class ActivityLogsService {
  private jsonApiService = inject(JsonApiService);
  private activityDisplayService = inject(ActivityLogDisplayService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly apiUrl = `${this.environment.apiDomainUrl}/v2`;

  fetchLogs(
    resourceType: CurrentResourceType.Projects | CurrentResourceType.Registrations,
    resourceId: string,
    page = 1,
    pageSize: number
  ): Observable<PaginatedData<ActivityLogWithDisplay[]>> {
    const url = `${this.apiUrl}/${resourceType}/${resourceId}/logs/`;
    const params: Record<string, unknown> = {
      'embed[]': ['original_node', 'user', 'linked_node', 'linked_registration', 'template_node'],
      page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<ResponseJsonApi<ActivityLogJsonApi[]>>(url, params)
      .pipe(map((res) => this.formatActivities(res)));
  }

  private formatActivities(response: ResponseJsonApi<ActivityLogJsonApi[]>): PaginatedData<ActivityLogWithDisplay[]> {
    const mapped = ActivityLogsMapper.fromGetActivityLogsResponse(response);

    return {
      ...mapped,
      data: mapped.data.map((log) => ({
        ...log,
        formattedActivity: this.activityDisplayService.getActivityDisplay(log),
      })),
    };
  }
}
