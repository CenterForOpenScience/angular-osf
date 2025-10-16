import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { MyResourcesMapper } from '@osf/features/my-projects/mappers';

import { ResourceSearchMode, ResourceType, SortOrder } from '../enums';
import {
  CreateProjectPayloadJsoApi,
  EndpointType,
  JsonApiResponse,
  MyResourcesItem,
  MyResourcesItemGetResponseJsonApi,
  MyResourcesItemResponseJsonApi,
  MyResourcesResponseJsonApi,
  MyResourcesSearchFilters,
} from '../models';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class MyResourcesService {
  private sortFieldMap: Record<string, string> = {
    title: 'title',
    dateModified: 'date_modified',
    dateCreated: 'date_created',
  };

  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  private buildCommonParams(
    filters?: MyResourcesSearchFilters,
    pageNumber?: number,
    pageSize?: number,
    resourceType?: string
  ): Record<string, unknown> {
    const params: Record<string, unknown> = {
      'embed[]': ['bibliographic_contributors'],
      'fields[users]': 'family_name,full_name,given_name,middle_name',
    };

    if (resourceType) {
      params[`fields[${resourceType}]`] = 'title,date_created,date_modified,public,bibliographic_contributors';
    }

    if (filters?.searchValue && filters.searchFields?.length) {
      params[`filter[${filters.searchFields.join(',')}]`] = filters.searchValue;
    }

    if (pageNumber) {
      params['page'] = pageNumber;
    }

    if (pageSize) {
      params['page[size]'] = pageSize;
    }

    return params;
  }

  private getResources(
    endpoint: EndpointType,
    filters?: MyResourcesSearchFilters,
    pageNumber?: number,
    pageSize?: number,
    resourceType?: string,
    searchMode?: ResourceSearchMode,
    rootProjectId?: string
  ): Observable<MyResourcesItemResponseJsonApi> {
    const params = this.buildCommonParams(filters, pageNumber, pageSize, resourceType);

    if (searchMode !== ResourceSearchMode.All) {
      if (filters?.sortColumn && this.sortFieldMap[filters.sortColumn]) {
        const apiField = this.sortFieldMap[filters.sortColumn];
        const sortPrefix = filters.sortOrder === SortOrder.Desc ? '-' : '';
        params['sort'] = `${sortPrefix}${apiField}`;
      } else {
        params['sort'] = '-date_modified';
      }
    }

    if (rootProjectId) {
      params['filter[root][ne]'] = rootProjectId;
    }

    let url;
    if (searchMode === ResourceSearchMode.All) {
      url = `${this.apiUrl}/${endpoint}`;
    } else {
      url = endpoint.startsWith('collections/') ? `${this.apiUrl}/${endpoint}` : `${this.apiUrl}/users/me/${endpoint}`;
    }

    if (searchMode === ResourceSearchMode.Component) {
      params['filter[parent][ne]'] = null;
    }

    if (searchMode === ResourceSearchMode.Root) {
      params['filter[parent]'] = null;
    }

    return this.jsonApiService.get<MyResourcesResponseJsonApi>(url, params).pipe(
      map((response: MyResourcesResponseJsonApi) => ({
        data: response.data.map((item: MyResourcesItemGetResponseJsonApi) => MyResourcesMapper.fromResponse(item)),
        links: response.links,
        meta: response.meta,
      }))
    );
  }

  getMyProjects(
    filters?: MyResourcesSearchFilters,
    pageNumber?: number,
    pageSize?: number,
    searchMode?: ResourceSearchMode,
    rootProjectId?: string
  ): Observable<MyResourcesItemResponseJsonApi> {
    return this.getResources('nodes/', filters, pageNumber, pageSize, 'nodes', searchMode, rootProjectId);
  }

  getMyRegistrations(
    filters?: MyResourcesSearchFilters,
    pageNumber?: number,
    pageSize?: number,
    searchMode?: ResourceSearchMode,
    rootProjectId?: string
  ): Observable<MyResourcesItemResponseJsonApi> {
    return this.getResources(
      'registrations/',
      filters,
      pageNumber,
      pageSize,
      'registrations',
      searchMode,
      rootProjectId
    );
  }

  getMyPreprints(
    filters?: MyResourcesSearchFilters,
    pageNumber?: number,
    pageSize?: number
  ): Observable<MyResourcesItemResponseJsonApi> {
    return this.getResources('preprints/', filters, pageNumber, pageSize, 'preprints');
  }

  getMyBookmarks(
    collectionId: string,
    resourceType: ResourceType,
    filters?: MyResourcesSearchFilters,
    pageNumber?: number,
    pageSize?: number
  ): Observable<MyResourcesItemResponseJsonApi> {
    switch (resourceType) {
      case ResourceType.Project:
        return this.getResources(`collections/${collectionId}/linked_nodes/`, filters, pageNumber, pageSize, 'nodes');
      case ResourceType.Registration:
        return this.getResources(
          `collections/${collectionId}/linked_registrations/`,
          filters,
          pageNumber,
          pageSize,
          'registrations'
        );
      case ResourceType.Preprint:
        return this.getResources(
          `collections/${collectionId}/linked_preprints/`,
          filters,
          pageNumber,
          pageSize,
          'preprints'
        );
      default:
        return EMPTY;
    }
  }

  createProject(
    title: string,
    description: string,
    templateFrom: string,
    region: string,
    affiliations: string[]
  ): Observable<MyResourcesItem> {
    const payload: CreateProjectPayloadJsoApi = {
      data: {
        type: 'nodes',
        attributes: {
          title,
          ...(description && { description }),
          category: 'project',
          ...(templateFrom && { template_from: templateFrom }),
          public: false,
        },
        relationships: {
          region: {
            data: {
              type: 'regions',
              id: region,
            },
          },
          ...(affiliations.length > 0 && {
            affiliated_institutions: {
              data: affiliations.map((id) => ({
                type: 'institutions',
                id,
              })),
            },
          }),
        },
      },
    };

    const params: Record<string, unknown> = {
      'embed[]': ['bibliographic_contributors'],
      'fields[nodes]': 'title,date_modified,public,bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
    };

    return this.jsonApiService
      .post<JsonApiResponse<MyResourcesItemGetResponseJsonApi, null>>(`${this.apiUrl}/nodes/`, payload, params)
      .pipe(map((response) => MyResourcesMapper.fromResponse(response.data)));
  }
}
