import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { RequestAccessTrigger, ResourceType } from '../enums';
import { RequestAccessMapper } from '../mappers/request-access';
import { RequestAccessModel, RequestAccessPayload, RequestAccessResponseJsonApi } from '../models';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class RequestAccessService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
    [ResourceType.Preprint, 'preprints'],
    [ResourceType.DraftRegistration, 'draft_registrations'],
  ]);

  private getBaseUrl(resourceType: ResourceType, resourceId: string): string {
    const resourcePath = this.urlMap.get(resourceType);

    return `${this.apiUrl}/${resourcePath}/${resourceId}/requests`;
  }

  getRequestAccessList(resourceType: ResourceType, resourceId: string): Observable<RequestAccessModel[]> {
    const baseUrl = this.getBaseUrl(resourceType, resourceId);
    const params = { 'embed[]': ['creator'], 'filter[machine_state]': 'pending' };

    return this.jsonApiService
      .get<RequestAccessResponseJsonApi>(`${baseUrl}/`, params)
      .pipe(map((response) => RequestAccessMapper.getRequestAccessList(response.data)));
  }

  acceptRequestAccess(
    resourceType: ResourceType,
    requestAccessId: string,
    payload: RequestAccessPayload
  ): Observable<void> {
    const resourcePath = this.urlMap.get(resourceType);
    const baseUrl = `${this.apiUrl}/actions/requests/${resourcePath}/`;
    const body = RequestAccessMapper.convertToRequestAccessAction(
      requestAccessId,
      RequestAccessTrigger.Accept,
      payload
    );

    return this.jsonApiService.post<void>(`${baseUrl}`, body);
  }

  rejectRequestAccess(resourceType: ResourceType, requestAccessId: string): Observable<void> {
    const resourcePath = this.urlMap.get(resourceType);
    const baseUrl = `${this.apiUrl}/actions/requests/${resourcePath}/`;
    const body = RequestAccessMapper.convertToRequestAccessAction(requestAccessId, RequestAccessTrigger.Reject);

    return this.jsonApiService.post<void>(`${baseUrl}`, body);
  }

  requestAccessToProject(resourceId: string, comment = ''): Observable<void> {
    const payload = {
      data: {
        attributes: {
          comment,
          request_type: 'access',
        },
        type: 'node-requests',
      },
    };

    return this.jsonApiService.post<void>(`${this.apiUrl}/nodes/${resourceId}/requests/`, payload);
  }
}
