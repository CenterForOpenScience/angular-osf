import { forkJoin, map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { ResourceType } from '../enums/resource-type.enum';
import { SortOrder } from '../enums/sort-order.enum';
import { MyResourcesMapper } from '../mappers/my-resources.mapper';
import { SparseCollectionsResponseJsonApi } from '../models/collections/collections-json-api.models';
import {
  MyResourcesItem,
  MyResourcesItemGetResponseJsonApi,
  MyResourcesResponseJsonApi,
} from '../models/my-resources/my-resources.models';
import { MyResourcesSearchFilters } from '../models/my-resources/my-resources-search-filters.models';
import { PaginatedData } from '../models/paginated-data.model';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class BookmarksService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'linked_nodes'],
    [ResourceType.Registration, 'linked_registrations'],
  ]);

  private readonly resourceMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
  ]);

  private sortFieldMap: Record<string, string> = {
    title: 'title',
    dateModified: 'date_modified',
  };

  getBookmarksCollectionId(): Observable<string> {
    const params: Record<string, unknown> = {
      'fields[collections]': 'title,bookmarks',
    };

    return this.jsonApiService.get<SparseCollectionsResponseJsonApi>(`${this.apiUrl}/collections/`, params).pipe(
      map((response: SparseCollectionsResponseJsonApi) => {
        const bookmarksCollection = response.data.find(
          (collection) => collection.attributes.title === 'Bookmarks' && collection.attributes.bookmarks
        );
        return bookmarksCollection?.id ?? '';
      })
    );
  }

  getAllBookmarks(collectionId: string, filters?: MyResourcesSearchFilters) {
    const params = this.buildCommonParams(filters);

    return forkJoin({
      projects: this.getResourceBookmarks(collectionId, ResourceType.Project, params),
      registrations: this.getResourceBookmarks(collectionId, ResourceType.Registration, params),
    }).pipe(
      map(({ projects, registrations }) => {
        const items = [...projects.data, ...registrations.data];
        const data = this.sortBookmarks(items, filters?.sortColumn, filters?.sortOrder);
        const totalCount = projects.meta.total + registrations.meta.total;

        return { data, totalCount, pageSize: projects.meta.per_page } as PaginatedData<MyResourcesItem[]>;
      })
    );
  }

  getResourceBookmarks(collectionId: string, resourceType: ResourceType, params: Record<string, unknown> = {}) {
    const url = `${this.apiUrl}/collections/${collectionId}/${this.urlMap.get(resourceType)}/`;

    return this.jsonApiService.get<MyResourcesResponseJsonApi>(url, params).pipe(
      map((response: MyResourcesResponseJsonApi) => ({
        data: response.data.map((item: MyResourcesItemGetResponseJsonApi) => MyResourcesMapper.fromResponse(item)),
        links: response.links,
        meta: response.meta,
      }))
    );
  }

  addResourceToBookmarks(bookmarksId: string, resourceId: string, resourceType: ResourceType): Observable<void> {
    const url = `${this.apiUrl}/collections/${bookmarksId}/relationships/${this.urlMap.get(resourceType)}/`;
    const payload = { data: [{ type: this.resourceMap.get(resourceType), id: resourceId }] };

    return this.jsonApiService.post<void>(url, payload);
  }

  removeResourceFromBookmarks(bookmarksId: string, resourceId: string, resourceType: ResourceType): Observable<void> {
    const url = `${this.apiUrl}/collections/${bookmarksId}/relationships/${this.urlMap.get(resourceType)}/`;
    const payload = { data: [{ type: this.resourceMap.get(resourceType), id: resourceId }] };

    return this.jsonApiService.delete(url, payload);
  }

  private buildCommonParams(filters?: MyResourcesSearchFilters): Record<string, unknown> {
    const params: Record<string, unknown> = {
      'embed[]': ['bibliographic_contributors'],
      pageNumber: 1,
      pageSize: 100,
    };

    if (filters?.searchValue && filters.searchFields?.length) {
      params[`filter[${filters.searchFields.join(',')}]`] = filters.searchValue;
    }

    if (filters?.sortColumn && this.sortFieldMap[filters.sortColumn]) {
      const apiField = this.sortFieldMap[filters.sortColumn];
      const sortPrefix = filters.sortOrder === SortOrder.Desc ? '-' : '';
      params['sort'] = `${sortPrefix}${apiField}`;
    } else {
      params['sort'] = '-date_modified';
    }

    return params;
  }

  private sortBookmarks(items: MyResourcesItem[], sortColumn = 'dateModified', direction = SortOrder.Desc) {
    return items.sort((a, b) => {
      if (sortColumn === 'title') {
        return direction * (a.title ?? '').localeCompare(b.title ?? '', undefined, { sensitivity: 'base' });
      }

      const aTime = a.dateModified ? new Date(a.dateModified).getTime() : 0;
      const bTime = b.dateModified ? new Date(b.dateModified).getTime() : 0;
      return direction * (aTime - bTime);
    });
  }
}
