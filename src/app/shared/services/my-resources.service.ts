import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { DEFAULT_TABLE_PARAMS } from '../constants/default-table-params.constants';
import { ResourceSearchMode } from '../enums/resource-search-mode.enum';
import { ResourceVisibilityFilter } from '../enums/resource-visibility-filter.enum';
import { SortOrder } from '../enums/sort-order.enum';
import { MyResourcesMapper } from '../mappers/my-resources.mapper';
import { EndpointType } from '../models/my-resources/my-resources-endpoint.type';
import { MyResourcesItem } from '../models/my-resources/my-resources-item.model';
import {
  MyResourcesItemResponseJsonApi,
  MyResourcesResponseJsonApi,
} from '../models/my-resources/my-resources-json-api.model';
import { MyResourcesSearchFilters } from '../models/my-resources/my-resources-search-filters.model';
import { CreateProjectPayloadJsoApi } from '../models/nodes/nodes-json-api.model';
import { PaginatedData } from '../models/paginated-data.model';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class MyResourcesService {
  private sortFieldMap: Record<string, string> = {
    title: 'title',
    dateModified: 'date_modified',
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
    rootProjectId?: string,
    visibilityFilter?: ResourceVisibilityFilter
  ): Observable<PaginatedData<MyResourcesItem[]>> {
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

    const url =
      searchMode === ResourceSearchMode.All ? `${this.apiUrl}/${endpoint}` : `${this.apiUrl}/users/me/${endpoint}`;

    if (searchMode === ResourceSearchMode.Component) {
      params['filter[parent][ne]'] = null;
    }

    if (searchMode === ResourceSearchMode.Root) {
      params['filter[parent]'] = null;
    }

    if (visibilityFilter === ResourceVisibilityFilter.Public) {
      params['filter[public]'] = true;
    } else if (visibilityFilter === ResourceVisibilityFilter.Private) {
      params['filter[public]'] = false;
    }

    return this.jsonApiService.get<MyResourcesResponseJsonApi>(url, params).pipe(
      map((response: MyResourcesResponseJsonApi) => ({
        data: response.data.map((item) => MyResourcesMapper.fromResponse(item)),
        totalCount: response.meta.total,
        pageSize: response.meta.per_page ?? DEFAULT_TABLE_PARAMS.rows,
      }))
    );
  }

  getMyProjects(
    filters?: MyResourcesSearchFilters,
    pageNumber?: number,
    pageSize?: number,
    searchMode?: ResourceSearchMode,
    rootProjectId?: string,
    visibilityFilter?: ResourceVisibilityFilter
  ): Observable<PaginatedData<MyResourcesItem[]>> {
    return this.getResources(
      'nodes/',
      filters,
      pageNumber,
      pageSize,
      'nodes',
      searchMode,
      rootProjectId,
      visibilityFilter
    );
  }

  getMyRegistrations(
    filters?: MyResourcesSearchFilters,
    pageNumber?: number,
    pageSize?: number,
    searchMode?: ResourceSearchMode,
    rootProjectId?: string
  ): Observable<PaginatedData<MyResourcesItem[]>> {
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
  ): Observable<PaginatedData<MyResourcesItem[]>> {
    return this.getResources('preprints/', filters, pageNumber, pageSize, 'preprints');
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
      .post<MyResourcesItemResponseJsonApi>(`${this.apiUrl}/nodes/`, payload, params)
      .pipe(map((response) => MyResourcesMapper.fromResponse(response.data)));
  }
}
