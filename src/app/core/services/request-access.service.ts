import { Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/shared/services';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestAccessService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly apiUrl = `${environment.apiDomainUrl}/v2`;

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
