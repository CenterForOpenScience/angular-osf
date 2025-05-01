import { inject, Injectable } from '@angular/core';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { Observable } from 'rxjs';
import { MyProjectsSearchFilters } from '@osf/features/my-projects/entities/my-projects-search-filters.models';
import { MyProjectsMapper } from '@osf/features/my-projects/mappers/my-projects.mapper';
import {
  MyProjectsItemResponse,
  MyProjectsItemGetResponse,
  MyProjectsJsonApiResponse,
  SparseCollectionsResponse,
} from '@osf/features/my-projects/entities/my-projects.entities';
import { map } from 'rxjs/operators';
import { SortOrder } from '@shared/utils/sort-order.enum';
import { EndpointType } from '@osf/features/my-projects/entities/my-projects.types';

@Injectable({
  providedIn: 'root',
})
export class MyProjectsService {
  #baseUrl = 'https://api.staging4.osf.io/v2/';
  #jsonApiService = inject(JsonApiService);
  #sortFieldMap: Record<string, string> = {
    title: 'title',
    dateModified: 'date_modified',
  };

  #getMyItems(
    endpoint: EndpointType,
    filters?: MyProjectsSearchFilters,
    pageNumber?: number,
    pageSize?: number,
  ): Observable<MyProjectsItemResponse> {
    const params: Record<string, unknown> = {
      'embed[]': ['bibliographic_contributors'],
      [`fields[${endpoint}]`]:
        'title,date_modified,public,bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
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

    if (filters?.sortColumn && this.#sortFieldMap[filters.sortColumn]) {
      const apiField = this.#sortFieldMap[filters.sortColumn];
      const sortPrefix = filters.sortOrder === SortOrder.Desc ? '-' : '';
      params['sort'] = `${sortPrefix}${apiField}`;
    } else {
      params['sort'] = '-date_modified';
    }

    const url = endpoint.startsWith('collections/')
      ? this.#baseUrl + endpoint
      : this.#baseUrl + 'users/me/' + endpoint;

    return this.#jsonApiService
      .get<MyProjectsJsonApiResponse>(url, params)
      .pipe(
        map((response: MyProjectsJsonApiResponse) => ({
          data: response.data.map((item: MyProjectsItemGetResponse) =>
            MyProjectsMapper.fromResponse(item),
          ),
          links: response.links,
        })),
      );
  }

  getMyProjects(
    filters?: MyProjectsSearchFilters,
    pageNumber?: number,
    pageSize?: number,
  ): Observable<MyProjectsItemResponse> {
    return this.#getMyItems('nodes', filters, pageNumber, pageSize);
  }

  getBookmarksCollectionId(): Observable<string> {
    const params: Record<string, unknown> = {
      'fields[collections]': 'title,bookmarks',
    };

    return this.#jsonApiService
      .get<SparseCollectionsResponse>(this.#baseUrl + 'collections', params)
      .pipe(
        map((response) => {
          const bookmarksCollection = response.data.find(
            (collection) =>
              collection.attributes.title === 'Bookmarks' &&
              collection.attributes.bookmarks,
          );
          return bookmarksCollection?.id ?? '';
        }),
      );
  }

  getMyRegistrations(
    filters?: MyProjectsSearchFilters,
    pageNumber?: number,
    pageSize?: number,
  ): Observable<MyProjectsItemResponse> {
    return this.#getMyItems('registrations', filters, pageNumber, pageSize);
  }

  getMyPreprints(
    filters?: MyProjectsSearchFilters,
    pageNumber?: number,
    pageSize?: number,
  ): Observable<MyProjectsItemResponse> {
    return this.#getMyItems('preprints', filters, pageNumber, pageSize);
  }

  getMyBookmarks(
    collectionId: string,
    filters?: MyProjectsSearchFilters,
    pageNumber?: number,
    pageSize?: number,
  ): Observable<MyProjectsItemResponse> {
    return this.#getMyItems(
      `collections/${collectionId}/linked_nodes`,
      filters,
      pageNumber,
      pageSize,
    );
  }
}
