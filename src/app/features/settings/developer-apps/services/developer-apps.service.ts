import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { JsonApiService } from '@osf/shared/services/json-api.service';

import { DeveloperAppMapper } from '../mappers';
import {
  DeveloperApp,
  DeveloperAppCreateUpdate,
  DeveloperAppDataJsonApi,
  DeveloperAppResponseJsonApi,
  DeveloperAppsListResponseJsonApi,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class DeveloperApplicationsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2/applications/`;
  }

  getApplications(): Observable<DeveloperApp[]> {
    return this.jsonApiService
      .get<DeveloperAppsListResponseJsonApi>(this.apiUrl)
      .pipe(map((responses) => responses.data.map((response) => DeveloperAppMapper.fromGetResponse(response))));
  }

  getApplicationDetails(clientId: string): Observable<DeveloperApp> {
    return this.jsonApiService
      .get<DeveloperAppResponseJsonApi>(`${this.apiUrl}${clientId}/`)
      .pipe(map((response) => DeveloperAppMapper.fromGetResponse(response.data)));
  }

  createApplication(developerAppCreate: DeveloperAppCreateUpdate): Observable<DeveloperApp> {
    const request = DeveloperAppMapper.toCreateRequest(developerAppCreate);

    return this.jsonApiService
      .post<DeveloperAppResponseJsonApi>(this.apiUrl, request)
      .pipe(map((response) => DeveloperAppMapper.fromGetResponse(response.data)));
  }

  updateApp(clientId: string, developerAppUpdate: DeveloperAppCreateUpdate): Observable<DeveloperApp> {
    const request = DeveloperAppMapper.toUpdateRequest(developerAppUpdate);

    return this.jsonApiService
      .patch<DeveloperAppDataJsonApi>(`${this.apiUrl}${clientId}/`, request)
      .pipe(map((response) => DeveloperAppMapper.fromGetResponse(response)));
  }

  resetClientSecret(clientId: string) {
    const request = DeveloperAppMapper.toResetSecretRequest(clientId);

    return this.jsonApiService
      .patch<DeveloperAppDataJsonApi>(`${this.apiUrl}${clientId}/`, request)
      .pipe(map((response) => DeveloperAppMapper.fromGetResponse(response)));
  }

  deleteApplication(clientId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}${clientId}/`);
  }
}
