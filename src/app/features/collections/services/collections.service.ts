import { createDispatchMap } from '@ngxs/store';

import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponseWithPaging } from '@core/models';
import { JsonApiService } from '@osf/core/services';
import { CollectionsMapper } from '@osf/features/collections/mappers';
import { SetTotalSubmissions } from '@osf/features/collections/store';

import {
  CollectionContributor,
  CollectionDetails,
  CollectionDetailsGetResponseJsonApi,
  CollectionProvider,
  CollectionProviderGetResponseJsonApi,
  CollectionSubmission,
  CollectionSubmissionJsonApi,
  CollectionSubmissionsPayloadJsonApi,
  ContributorsResponseJsonApi,
  SparseCollectionsResponseJsonApi,
} from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private jsonApiService = inject(JsonApiService);
  private actions = createDispatchMap({
    setTotalSubmissions: SetTotalSubmissions,
  });

  getBookmarksCollectionId(): Observable<string> {
    const params: Record<string, unknown> = {
      'fields[collections]': 'title,bookmarks',
    };

    return this.jsonApiService.get<SparseCollectionsResponseJsonApi>(environment.apiUrl + '/collections/', params).pipe(
      map((response: SparseCollectionsResponseJsonApi) => {
        const bookmarksCollection = response.data.find(
          (collection) => collection.attributes.title === 'Bookmarks' && collection.attributes.bookmarks
        );
        return bookmarksCollection?.id ?? '';
      })
    );
  }

  addProjectToBookmarks(bookmarksId: string, projectId: string): Observable<void> {
    const url = `${environment.apiUrl}/collections/${bookmarksId}/relationships/linked_nodes/`;
    const payload = {
      data: [
        {
          type: 'linked_nodes',
          id: projectId,
        },
      ],
    };

    return this.jsonApiService.post<void>(url, payload);
  }

  removeProjectFromBookmarks(bookmarksId: string, projectId: string): Observable<void> {
    const url = `${environment.apiUrl}/collections/${bookmarksId}/relationships/linked_nodes/`;
    const payload = {
      data: [
        {
          type: 'linked_nodes',
          id: projectId,
        },
      ],
    };

    return this.jsonApiService.delete(url, payload);
  }

  getCollectionProvider(collectionName: string): Observable<CollectionProvider> {
    const url = `${environment.apiUrl}/providers/collections/${collectionName}/`;

    return this.jsonApiService
      .get<CollectionProviderGetResponseJsonApi>(url)
      .pipe(map((response) => CollectionsMapper.fromGetCollectionProviderResponse(response.data)));
  }

  getCollectionDetails(collectionId: string): Observable<CollectionDetails> {
    const url = `${environment.apiUrl}/collections/${collectionId}/`;

    return this.jsonApiService
      .get<CollectionDetailsGetResponseJsonApi>(url)
      .pipe(map((response) => CollectionsMapper.fromGetCollectionDetailsResponse(response.data)));
  }

  getCollectionSubmissions(
    providerId: string,
    searchText: string,
    activeFilters: Record<string, string[]>,
    page = '1',
    sortBy: string
  ): Observable<CollectionSubmission[]> {
    const url = `${environment.apiUrl}/search/collections/`;
    const params: Record<string, string> = {
      page,
    };

    if (sortBy) {
      params['sort'] = sortBy;
    }

    const payload: CollectionSubmissionsPayloadJsonApi = {
      data: {
        attributes: {
          provider: [providerId],
          ...activeFilters,
          q: searchText ? searchText : '*',
        },
      },
      type: 'search',
    };

    return this.jsonApiService
      .post<JsonApiResponseWithPaging<CollectionSubmissionJsonApi[], null>>(url, payload, params)
      .pipe(
        switchMap((response) => {
          if (!response.data.length) {
            return of([]);
          }

          const contributorUrls = response.data.map(
            (submission) => submission.embeds.guid.data.relationships.bibliographic_contributors.links.related.href
          );
          const contributorRequests = contributorUrls.map((url) => this.getCollectionContributors(url));
          const totalCount = response.links.meta?.total ?? 0;
          this.actions.setTotalSubmissions(totalCount);

          return forkJoin(contributorRequests).pipe(
            map((contributorsArrays) => {
              return response.data.map((submission, index) => ({
                ...CollectionsMapper.fromPostCollectionSubmissionsResponse([submission])[0],
                contributors: contributorsArrays[index],
              }));
            })
          );
        })
      );
  }

  private getCollectionContributors(contributorsUrl: string): Observable<CollectionContributor[]> {
    const params: Record<string, unknown> = {
      'fields[users]': 'full_name',
    };

    return this.jsonApiService.get<ContributorsResponseJsonApi>(contributorsUrl, params).pipe(
      map((response: ContributorsResponseJsonApi) => {
        return CollectionsMapper.fromGetCollectionContributorsResponse(response.data);
      })
    );
  }

  addRegistrationToBookmarks(bookmarksId: string, registryId: string): Observable<void> {
    const url = `${environment.apiUrl}/collections/${bookmarksId}/relationships/linked_registrations/`;
    const payload = {
      data: [
        {
          type: 'linked_registrations',
          id: registryId,
        },
      ],
    };

    return this.jsonApiService.post<void>(url, payload);
  }

  removeRegistrationFromBookmarks(bookmarksId: string, registryId: string): Observable<void> {
    const url = `${environment.apiUrl}/collections/${bookmarksId}/relationships/linked_registrations/`;
    const payload = {
      data: [
        {
          type: 'linked_registrations',
          id: registryId,
        },
      ],
    };

    return this.jsonApiService.delete(url, payload);
  }
}
