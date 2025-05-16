import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services/json-api/json-api.service';
import {
  MyProjectsItem,
  MyProjectsItemGetResponse,
  MyProjectsItemResponse,
  MyProjectsJsonApiResponse,
  SparseCollectionsResponse,
} from '@osf/features/my-projects/entities/my-projects.entities';
import { EndpointType } from '@osf/features/my-projects/entities/my-projects.types';
import { MyProjectsSearchFilters } from '@osf/features/my-projects/entities/my-projects-search-filters.models';
import { MyProjectsMapper } from '@osf/features/my-projects/mappers/my-projects.mapper';
import { SortOrder } from '@shared/utils/sort-order.enum';

import { environment } from '../../../environments/environment';

import { CreateProjectPayload } from './entities/create-project.entities';

@Injectable({
  providedIn: 'root',
})
export class MyProjectsService {
  #jsonApiService = inject(JsonApiService);
  #sortFieldMap: Record<string, string> = {
    title: 'title',
    dateModified: 'date_modified',
  };

  #getMyItems(
    endpoint: EndpointType,
    filters?: MyProjectsSearchFilters,
    pageNumber?: number,
    pageSize?: number
  ): Observable<MyProjectsItemResponse> {
    const params: Record<string, unknown> = {
      'embed[]': ['bibliographic_contributors'],
      [`fields[${endpoint}]`]: 'title,date_modified,public,bibliographic_contributors',
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
    const url = environment.apiUrl + '/' + endpoint + '/';
    // const url = endpoint.startsWith('collections/')
    //   ? environment.apiUrl + '/' + endpoint
    //   : environment.apiUrl + '/users/me/' + endpoint;

    return this.#jsonApiService.get<MyProjectsJsonApiResponse>(url, params).pipe(
      map((response: MyProjectsJsonApiResponse) => ({
        data: response.data.map((item: MyProjectsItemGetResponse) => MyProjectsMapper.fromResponse(item)),
        links: response.links,
      }))
    );
  }

  getMyProjects(
    filters?: MyProjectsSearchFilters,
    pageNumber?: number,
    pageSize?: number
  ): Observable<MyProjectsItemResponse> {
    return this.#getMyItems('nodes', filters, pageNumber, pageSize);
  }

  getBookmarksCollectionId(): Observable<string> {
    const params: Record<string, unknown> = {
      'fields[collections]': 'title,bookmarks',
    };

    return this.#jsonApiService.get<SparseCollectionsResponse>(environment.apiUrl + '/collections/', params).pipe(
      map((response) => {
        const bookmarksCollection = response.data.find(
          (collection) => collection.attributes.title === 'Bookmarks' && collection.attributes.bookmarks
        );
        return bookmarksCollection?.id ?? '';
      })
    );
  }

  getMyRegistrations(
    filters?: MyProjectsSearchFilters,
    pageNumber?: number,
    pageSize?: number
  ): Observable<MyProjectsItemResponse> {
    return this.#getMyItems('registrations', filters, pageNumber, pageSize);
  }

  getMyPreprints(
    filters?: MyProjectsSearchFilters,
    pageNumber?: number,
    pageSize?: number
  ): Observable<MyProjectsItemResponse> {
    return this.#getMyItems('preprints', filters, pageNumber, pageSize);
  }

  getMyBookmarks(
    collectionId: string,
    filters?: MyProjectsSearchFilters,
    pageNumber?: number,
    pageSize?: number
  ): Observable<MyProjectsItemResponse> {
    return this.#getMyItems(`collections/${collectionId}/linked_nodes/`, filters, pageNumber, pageSize);
  }

  createProject(
    title: string,
    description: string,
    templateFrom: string,
    region: string,
    affiliations: string[]
  ): Observable<MyProjectsItem> {
    const payload: CreateProjectPayload = {
      data: {
        type: 'nodes',
        attributes: {
          title,
          ...(description && { description }),
          category: 'project',
          ...(templateFrom && { template_from: templateFrom }),
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

    return this.#jsonApiService
      .post<MyProjectsItemGetResponse>(`${environment.apiUrl}/nodes/`, payload, params)
      .pipe(map((response) => MyProjectsMapper.fromResponse(response)));
  }
}
