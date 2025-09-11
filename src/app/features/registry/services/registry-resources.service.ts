import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { MapAddResourceRequest, MapRegistryResource, toAddResourceRequestBody } from '@osf/features/registry/mappers';
import { GetRegistryResourcesJsonApi, RegistryResource } from '@osf/features/registry/models';
import { AddResource } from '@osf/features/registry/models/resources/add-resource.model';
import {
  AddResourceJsonApi,
  RegistryResourceDataJsonApi,
} from '@osf/features/registry/models/resources/add-resource-response-json-api.model';
import { ConfirmAddResource } from '@osf/features/registry/models/resources/confirm-add-resource.model';
import { JsonApiService } from '@shared/services';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistryResourcesService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly apiUrl = `${environment.apiDomainUrl}/v2`;

  getResources(registryId: string): Observable<RegistryResource[]> {
    const params = {
      'fields[resources]': 'description,finalized,resource_type,pid',
    };

    return this.jsonApiService
      .get<GetRegistryResourcesJsonApi>(`${this.apiUrl}/registrations/${registryId}/resources/?page=1`, params)
      .pipe(map((response) => response.data.map((resource) => MapRegistryResource(resource))));
  }

  addRegistryResource(registryId: string): Observable<RegistryResource> {
    const body = toAddResourceRequestBody(registryId);

    return this.jsonApiService.post<AddResourceJsonApi>(`${this.apiUrl}/resources/`, body).pipe(
      map((response) => {
        return MapRegistryResource(response.data);
      })
    );
  }

  previewRegistryResource(resourceId: string, resource: AddResource): Observable<RegistryResource> {
    const payload = MapAddResourceRequest(resourceId, resource);

    return this.jsonApiService
      .patch<RegistryResourceDataJsonApi>(`${this.apiUrl}/resources/${resourceId}/`, payload)
      .pipe(
        map((response) => {
          return MapRegistryResource(response);
        })
      );
  }

  confirmAddingResource(resourceId: string, resource: ConfirmAddResource): Observable<RegistryResource> {
    const payload = MapAddResourceRequest(resourceId, resource);

    return this.jsonApiService
      .patch<RegistryResourceDataJsonApi>(`${this.apiUrl}/resources/${resourceId}/`, payload)
      .pipe(
        map((response) => {
          return MapRegistryResource(response);
        })
      );
  }

  deleteResource(resourceId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/resources/${resourceId}/`);
  }

  updateResource(resourceId: string, resource: AddResource) {
    const payload = MapAddResourceRequest(resourceId, resource);

    return this.jsonApiService.patch(`${this.apiUrl}/resources/${resourceId}/`, payload);
  }
}
