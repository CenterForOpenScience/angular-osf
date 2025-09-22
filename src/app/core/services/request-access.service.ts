import { Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { JsonApiService } from '@osf/shared/services';

@Injectable({
  providedIn: 'root',
})
export class RequestAccessService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  requestAccessToProject(projectId: string, comment = ''): Observable<void> {
    const payload = {
      data: {
        attributes: {
          comment,
          request_type: 'access',
        },
        type: 'node-requests',
      },
    };

    return this.jsonApiService.post<void>(`${this.apiUrl}/nodes/${projectId}/requests/`, payload);
  }
}
