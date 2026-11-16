import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { DEFAULT_TABLE_PARAMS } from '../constants/default-table-params.constants';
import { ResourceSearchMode } from '../enums/resource-search-mode.enum';
import { CurrentResourceType } from '../enums/resource-type.enum';
import { ResourceVisibilityFilter } from '../enums/resource-visibility-filter.enum';
import { SortOrder } from '../enums/sort-order.enum';
import { MyResourcesMapper } from '../mappers/my-resources.mapper';
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
    resourceType: CurrentResourceType,
    filters?: MyResourcesSearchFilters,
    pageNumber?: number,
    pageSize?: number
  ): Record<string, unknown> {
    const fields = ['title', 'date_created', 'date_modified', 'public', 'bibliographic_contributors'];
    if (resourceType === CurrentResourceType.Preprints) {
      fields.push('is_migrated');
    }

    const params: Record<string, unknown> = {
      'embed[]': ['bibliographic_contributors'],
      'fields[users]': 'family_name,full_name,given_name,middle_name',
      [`fields[${resourceType}]`]: fields.join(','),
    };

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
    resourceType: CurrentResourceType,
    filters?: MyResourcesSearchFilters,
    pageNumber?: number,
    pageSize?: number,
    searchMode?: ResourceSearchMode,
    visibilityFilter?: ResourceVisibilityFilter
  ): Observable<PaginatedData<MyResourcesItem[]>> {
    const params = this.buildCommonParams(resourceType, filters, pageNumber, pageSize);

    if (searchMode !== ResourceSearchMode.All) {
      if (filters?.sortColumn && this.sortFieldMap[filters.sortColumn]) {
        const apiField = this.sortFieldMap[filters.sortColumn];
        const sortPrefix = filters.sortOrder === SortOrder.Desc ? '-' : '';
        params['sort'] = `${sortPrefix}${apiField}`;
      } else {
        params['sort'] = '-date_modified';
      }
    }

    const url =
      searchMode === ResourceSearchMode.All
        ? `${this.apiUrl}/${resourceType}/`
        : `${this.apiUrl}/users/me/${resourceType}/`;

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
    visibilityFilter?: ResourceVisibilityFilter
  ): Observable<PaginatedData<MyResourcesItem[]>> {
    return this.getResources(CurrentResourceType.Projects, filters, pageNumber, pageSize, searchMode, visibilityFilter);
  }

  getMyRegistrations(
    filters?: MyResourcesSearchFilters,
    pageNumber?: number,
    pageSize?: number,
    searchMode?: ResourceSearchMode
  ): Observable<PaginatedData<MyResourcesItem[]>> {
    return this.getResources(CurrentResourceType.Registrations, filters, pageNumber, pageSize, searchMode);
  }

  getMyPreprints(
    filters?: MyResourcesSearchFilters,
    pageNumber?: number,
    pageSize?: number
  ): Observable<PaginatedData<MyResourcesItem[]>> {
    return this.getResources(CurrentResourceType.Preprints, filters, pageNumber, pageSize);
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
        type: CurrentResourceType.Projects,
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
      [`fields[${CurrentResourceType.Projects}]`]: 'title,date_modified,public,bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
    };

    return this.jsonApiService
      .post<MyResourcesItemResponseJsonApi>(`${this.apiUrl}/${CurrentResourceType.Projects}/`, payload, params)
      .pipe(map((response) => MyResourcesMapper.fromResponse(response.data)));
  }
}
