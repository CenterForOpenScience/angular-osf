import { Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '../../shared/services/json-api.service';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestAccessService {
  jsonApiService = inject(JsonApiService);

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

    return this.jsonApiService.post<void>(`${environment.apiUrl}/nodes/${projectId}/requests/`, payload);
  }
}
