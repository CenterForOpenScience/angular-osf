import { createDispatchMap } from '@ngxs/store';

import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse, JsonApiResponseWithPaging } from '@core/models';
import { JsonApiService } from '@osf/core/services';
import { CollectionsMapper } from '@osf/features/collections/mappers';
import { SetTotalSubmissions } from '@osf/features/collections/store/collections';

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

  searchCollectionSubmissions(
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

  fetchAllUserCollectionSubmissions(providerId: string, projectIds: string[]): Observable<CollectionSubmission[]> {
    const pendingSubmissions$ = this.fetchUserCollectionSubmissionsByStatus(providerId, projectIds, 'pending');
    const acceptedSubmissions$ = this.fetchUserCollectionSubmissionsByStatus(providerId, projectIds, 'accepted');

    return forkJoin([pendingSubmissions$, acceptedSubmissions$]).pipe(
      map(([pending, accepted]) => [...pending, ...accepted])
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

  private fetchUserCollectionSubmissionsByStatus(
    providerId: string,
    projectIds: string[],
    submissionStatus: string
  ): Observable<CollectionSubmission[]> {
    const params: Record<string, unknown> = {
      'filter[reviews_state]': submissionStatus,
      'filter[id]': projectIds.join(','),
    };

    return this.jsonApiService
      .get<
        JsonApiResponse<CollectionSubmissionJsonApi[], null>
      >(`${environment.apiUrl}/collections/${providerId}/collection_submissions/`, params)
      .pipe(
        map((response) => {
          return CollectionsMapper.fromGetCollectionSubmissionsResponse(response.data);
        })
      );
  }
}
