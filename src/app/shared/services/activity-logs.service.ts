import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponseWithPaging } from '@core/models';
import { JsonApiService } from '@core/services';
import { ActivityLogJsonApi } from '@shared/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogsService {
  private jsonApiService = inject(JsonApiService);

  fetchLogs(projectId: string, page = '1', pageSize: string): Observable<ActivityLogJsonApi[]> {
    const url = `${environment.apiUrl}/nodes/${projectId}/logs/`;
    const params: Record<string, unknown> = {
      'embed[]': ['original_node', 'user', 'linked_node', 'linked_registration', 'template_node', 'group'],
      page,
      'page[size]': pageSize,
    };

    return this.jsonApiService.get<JsonApiResponseWithPaging<ActivityLogJsonApi[], null>>(url, params).pipe(
      map((res) => {
        return res.data;
      })
    );
  }
}
