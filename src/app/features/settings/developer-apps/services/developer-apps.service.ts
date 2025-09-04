import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { DeveloperAppMapper } from '../mappers';
import { DeveloperApp, DeveloperAppCreateUpdate, DeveloperAppGetResponseJsonApi } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeveloperApplicationsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly baseUrl = `${environment.apiUrl}/applications/`;

  getApplications(): Observable<DeveloperApp[]> {
    return this.jsonApiService
      .get<JsonApiResponse<DeveloperAppGetResponseJsonApi[], null>>(this.baseUrl)
      .pipe(map((responses) => responses.data.map((response) => DeveloperAppMapper.fromGetResponse(response))));
  }

  getApplicationDetails(clientId: string): Observable<DeveloperApp> {
    return this.jsonApiService
      .get<JsonApiResponse<DeveloperAppGetResponseJsonApi, null>>(`${this.baseUrl}${clientId}/`)
      .pipe(map((response) => DeveloperAppMapper.fromGetResponse(response.data)));
  }

  createApplication(developerAppCreate: DeveloperAppCreateUpdate): Observable<DeveloperApp> {
    const request = DeveloperAppMapper.toCreateRequest(developerAppCreate);

    return this.jsonApiService
      .post<JsonApiResponse<DeveloperAppGetResponseJsonApi, null>>(this.baseUrl, request)
      .pipe(map((response) => DeveloperAppMapper.fromGetResponse(response.data)));
  }

  updateApp(clientId: string, developerAppUpdate: DeveloperAppCreateUpdate): Observable<DeveloperApp> {
    const request = DeveloperAppMapper.toUpdateRequest(developerAppUpdate);

    return this.jsonApiService
      .patch<DeveloperAppGetResponseJsonApi>(`${this.baseUrl}${clientId}/`, request)
      .pipe(map((response) => DeveloperAppMapper.fromGetResponse(response)));
  }

  resetClientSecret(clientId: string) {
    const request = DeveloperAppMapper.toResetSecretRequest(clientId);

    return this.jsonApiService
      .patch<DeveloperAppGetResponseJsonApi>(`${this.baseUrl}${clientId}/`, request)
      .pipe(map((response) => DeveloperAppMapper.fromGetResponse(response)));
  }

  deleteApplication(clientId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.baseUrl}${clientId}/`);
  }
}
