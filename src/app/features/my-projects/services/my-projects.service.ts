import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@core/models';
import { JsonApiService } from '@osf/core/services';
import { ResourceType, SortOrder } from '@osf/shared/enums';
import { NodeResponseModel, UpdateNodeRequestModel } from '@shared/models';

import { MyProjectsMapper } from '../mappers';
import {
  CreateProjectPayloadJsoApi,
  EndpointType,
  MyProjectsItem,
  MyProjectsItemGetResponseJsonApi,
  MyProjectsItemResponseJsonApi,
  MyProjectsResponseJsonApi,
  MyProjectsSearchFilters,
} from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyProjectsService {
  private apiUrl = environment.apiUrl;
  private sortFieldMap: Record<string, string> = {
    title: 'title',
    dateModified: 'date_modified',
  };

  private readonly jsonApiService = inject(JsonApiService);

  private getMyItems(
    endpoint: EndpointType,
    filters?: MyProjectsSearchFilters,
    pageNumber?: number,
    pageSize?: number,
    fields?: string
  ): Observable<MyProjectsItemResponseJsonApi> {
    const params: Record<string, unknown> = {
      'embed[]': ['bibliographic_contributors'],
      'fields[users]': 'family_name,full_name,given_name,middle_name',
    };

    if (fields) {
      params[`fields[${fields}]`] = 'title,date_modified,public,bibliographic_contributors';
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

    if (filters?.sortColumn && this.sortFieldMap[filters.sortColumn]) {
      const apiField = this.sortFieldMap[filters.sortColumn];
      const sortPrefix = filters.sortOrder === SortOrder.Desc ? '-' : '';
      params['sort'] = `${sortPrefix}${apiField}`;
    } else {
      params['sort'] = '-date_modified';
    }
    // const url = environment.apiUrl + '/' + endpoint + '/';
    const url = endpoint.startsWith('collections/')
      ? environment.apiUrl + '/' + endpoint
      : environment.apiUrl + '/users/me/' + endpoint;

    return this.jsonApiService.get<MyProjectsResponseJsonApi>(url, params).pipe(
      map((response: MyProjectsResponseJsonApi) => ({
        data: response.data.map((item: MyProjectsItemGetResponseJsonApi) => MyProjectsMapper.fromResponse(item)),
        links: response.links,
      }))
    );
  }

  getMyProjects(
    filters?: MyProjectsSearchFilters,
    pageNumber?: number,
    pageSize?: number
  ): Observable<MyProjectsItemResponseJsonApi> {
    return this.getMyItems('nodes', filters, pageNumber, pageSize, 'nodes');
  }

  getBookmarksCollectionId(): Observable<string> {
    const params: Record<string, unknown> = {
      'fields[collections]': 'title,bookmarks',
    };

    return this.jsonApiService.get<SparseCollectionsResponseJsonApi>(environment.apiUrl + '/collections/', params).pipe(
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
  ): Observable<MyProjectsItemResponseJsonApi> {
    return this.getMyItems('registrations', filters, pageNumber, pageSize, 'registrations');
  }

  getMyPreprints(
    filters?: MyProjectsSearchFilters,
    pageNumber?: number,
    pageSize?: number
  ): Observable<MyProjectsItemResponseJsonApi> {
    return this.getMyItems('preprints', filters, pageNumber, pageSize, 'preprints');
  }

  getMyBookmarks(
    collectionId: string,
    resourceType: ResourceType,
    filters?: MyProjectsSearchFilters,
    pageNumber?: number,
    pageSize?: number
  ): Observable<MyProjectsItemResponseJsonApi> {
    switch (resourceType) {
      case ResourceType.Project:
        return this.getMyItems(`collections/${collectionId}/linked_nodes/`, filters, pageNumber, pageSize, 'nodes');
      case ResourceType.Registration:
        return this.getMyItems(
          `collections/${collectionId}/linked_registrations/`,
          filters,
          pageNumber,
          pageSize,
          'registrations'
        );
      case ResourceType.Preprint:
        return this.getMyItems(
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
  ): Observable<MyProjectsItem> {
    const payload: CreateProjectPayloadJsoApi = {
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

    return this.jsonApiService
      .post<JsonApiResponse<MyProjectsItemGetResponseJsonApi, null>>(`${environment.apiUrl}/nodes/`, payload, params)
      .pipe(map((response) => MyProjectsMapper.fromResponse(response.data)));
  }

  getProjectById(projectId: string): Observable<NodeResponseModel> {
    return this.jsonApiService.get(`${this.apiUrl}/nodes/${projectId}`);
  }

  updateProjectById(model: UpdateNodeRequestModel): Observable<NodeResponseModel> {
    return this.jsonApiService.patch(`${this.apiUrl}/nodes/${model?.data?.id}`, model);
  }
}
