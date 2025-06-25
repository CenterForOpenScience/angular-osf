import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';

import { DeveloperAppMapper } from '../mappers';
import { DeveloperApp, DeveloperAppCreateUpdate, DeveloperAppGetResponse } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeveloperApplicationsService {
  jsonApiService = inject(JsonApiService);
  baseUrl = `${environment.apiUrl}/applications/`;

  getApplications(): Observable<DeveloperApp[]> {
    return this.jsonApiService.get<JsonApiResponse<DeveloperAppGetResponse[], null>>(this.baseUrl).pipe(
      map((responses) => {
        return responses.data.map((response) => DeveloperAppMapper.fromGetResponse(response));
      })
    );
  }

  getApplicationDetails(clientId: string): Observable<DeveloperApp> {
    return this.jsonApiService
      .get<JsonApiResponse<DeveloperAppGetResponse, null>>(this.baseUrl + clientId + '/')
      .pipe(map((response) => DeveloperAppMapper.fromGetResponse(response.data)));
  }

  createApplication(developerAppCreate: DeveloperAppCreateUpdate): Observable<DeveloperApp> {
    const request = DeveloperAppMapper.toCreateRequest(developerAppCreate);

    return this.jsonApiService
      .post<JsonApiResponse<DeveloperAppGetResponse, null>>(this.baseUrl, request)
      .pipe(map((response) => DeveloperAppMapper.fromGetResponse(response.data)));
  }

  updateApp(clientId: string, developerAppUpdate: DeveloperAppCreateUpdate): Observable<DeveloperApp> {
    const request = DeveloperAppMapper.toUpdateRequest(developerAppUpdate);

    return this.jsonApiService
      .patch<DeveloperAppGetResponse>(this.baseUrl + clientId + '/', request)
      .pipe(map((response) => DeveloperAppMapper.fromGetResponse(response)));
  }

  resetClientSecret(clientId: string) {
    const request = DeveloperAppMapper.toResetSecretRequest(clientId);

    return this.jsonApiService
      .patch<DeveloperAppGetResponse>(this.baseUrl + clientId + '/', request)
      .pipe(map((response) => DeveloperAppMapper.fromGetResponse(response)));
  }

  deleteApplication(clientId: string): Observable<void> {
    return this.jsonApiService.delete(this.baseUrl + clientId + '/');
  }
}
