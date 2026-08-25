import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

import { MapAddResourceRequest, MapRegistryResource, toAddResourceRequestBody } from '../mappers';
import {
  AddResource,
  AddResourceJsonApi,
  ConfirmAddResource,
  GetRegistryResourcesJsonApi,
  RegistryResource,
  RegistryResourceDataJsonApi,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class RegistryResourcesService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getResources(
    registryId: string,
    page = 1,
    pageSize = DEFAULT_TABLE_PARAMS.rows
  ): Observable<PaginatedData<RegistryResource[]>> {
    const params = {
      'fields[resources]': 'description,finalized,resource_type,pid',
      page,
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<GetRegistryResourcesJsonApi>(`${this.apiUrl}/registrations/${registryId}/resources/`, params)
      .pipe(
        map((response) => ({
          data: response.data.map((resource) => MapRegistryResource(resource)),
          totalCount: response.meta.total,
          pageSize: response.meta.per_page ?? DEFAULT_TABLE_PARAMS.rows,
        }))
      );
  }

  addRegistryResource(registryId: string): Observable<RegistryResource> {
    const body = toAddResourceRequestBody(registryId);

    return this.jsonApiService
      .post<AddResourceJsonApi>(`${this.apiUrl}/resources/`, body)
      .pipe(map((response) => MapRegistryResource(response.data)));
  }

  previewRegistryResource(resourceId: string, resource: AddResource): Observable<RegistryResource> {
    const payload = MapAddResourceRequest(resourceId, resource);

    return this.jsonApiService
      .patch<RegistryResourceDataJsonApi>(`${this.apiUrl}/resources/${resourceId}/`, payload)
      .pipe(map((response) => MapRegistryResource(response)));
  }

  confirmAddingResource(resourceId: string, resource: ConfirmAddResource): Observable<RegistryResource> {
    const payload = MapAddResourceRequest(resourceId, resource);

    return this.jsonApiService
      .patch<RegistryResourceDataJsonApi>(`${this.apiUrl}/resources/${resourceId}/`, payload)
      .pipe(map((response) => MapRegistryResource(response)));
  }

  deleteResource(resourceId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/resources/${resourceId}/`);
  }

  updateResource(resourceId: string, resource: AddResource) {
    const payload = MapAddResourceRequest(resourceId, resource);

    return this.jsonApiService.patch(`${this.apiUrl}/resources/${resourceId}/`, payload);
  }
}
