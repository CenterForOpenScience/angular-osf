import { Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponseWithPaging } from '@core/models';
import { JsonApiService } from '@core/services';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogsService {
  private jsonApiService = inject(JsonApiService);

  fetchLogs(projectId: string, page = '1', pageSize: string): Observable<unknown> {
    const url = `${environment.apiUrl}/nodes/${projectId}/logs`;
    const params: Record<string, unknown> = {
      'embed[]': ['original_node', 'user', 'linked_node', 'linked_registration', 'template_node', 'group'],
      page,
      pageSize,
    };

    return this.jsonApiService.get<JsonApiResponseWithPaging<unknown, null>>(url, params);
  }
}
