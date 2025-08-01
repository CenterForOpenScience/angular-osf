import { createDispatchMap } from '@ngxs/store';

import { forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse, JsonApiResponseWithPaging } from '@core/models';
import { JsonApiService } from '@core/services';
import {
  CollectionSubmissionReviewAction,
  CollectionSubmissionReviewActionJsonApi,
} from '@osf/features/moderation/models';
import { CollectionsMapper } from '@shared/mappers/collections';
import {
  CollectionContributor,
  CollectionDetails,
  CollectionDetailsGetResponseJsonApi,
  CollectionDetailsResponseJsonApi,
  CollectionProvider,
  CollectionProviderGetResponseJsonApi,
  CollectionSubmission,
  CollectionSubmissionJsonApi,
  CollectionSubmissionsSearchPayloadJsonApi,
  CollectionSubmissionWithGuid,
  CollectionSubmissionWithGuidJsonApi,
  ContributorsResponseJsonApi,
  PaginatedData,
  ReviewActionPayload,
} from '@shared/models';
import { ReviewActionPayloadJsonApi } from '@shared/models/collections/review-action-payload-json-api.model';
import { SetTotalSubmissions } from '@shared/stores/collections';

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
  ): Observable<CollectionSubmissionWithGuid[]> {
    const url = `${environment.apiUrl}/search/collections/`;
    const params: Record<string, string> = {
      page,
    };

    if (sortBy) {
      params['sort'] = sortBy;
    }

    const payload: CollectionSubmissionsSearchPayloadJsonApi = {
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
      .post<JsonApiResponseWithPaging<CollectionSubmissionWithGuidJsonApi[], null>>(url, payload, params)
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

  fetchCollectionSubmissionsByStatus(
    collectionId: string,
    status: string,
    page = '1',
    sortBy: string
  ): Observable<PaginatedData<CollectionSubmissionWithGuid[]>> {
    const params: Record<string, string> = {
      page,
      'filter[reviews_state]': status,
      'page[size]': '10',
      embed: 'creator',
      sort: sortBy,
    };

    return this.jsonApiService
      .get<
        JsonApiResponseWithPaging<CollectionSubmissionWithGuidJsonApi[], null>
      >(`${environment.apiUrl}/collections/${collectionId}/collection_submissions/`, params)
      .pipe(
        map((response) => {
          return CollectionsMapper.fromGetCollectionSubmissionsResponse(response);
        })
      );
  }

  fetchProjectCollections(projectId: string): Observable<CollectionDetails[]> {
    return this.jsonApiService
      .get<
        JsonApiResponse<CollectionDetailsResponseJsonApi[], null>
      >(`${environment.apiUrl}/nodes/${projectId}/collections/`)
      .pipe(
        map((response) =>
          response.data.map((collection) => CollectionsMapper.fromGetCollectionDetailsResponse(collection))
        )
      );
  }

  fetchCurrentSubmission(projectId: string, collectionId: string): Observable<CollectionSubmission> {
    const params: Record<string, string> = {
      'filter[id]': projectId,
      embed: 'collection',
    };

    return this.jsonApiService
      .get<
        JsonApiResponse<CollectionSubmissionJsonApi[], null>
      >(`${environment.apiUrl}/collections/${collectionId}/collection_submissions/`, params)
      .pipe(
        map((response) => {
          return CollectionsMapper.fromCurrentSubmissionResponse(response.data[0]);
        })
      );
  }

  fetchCollectionSubmissionsActions(
    projectId: string,
    collectionId: string
  ): Observable<CollectionSubmissionReviewAction[]> {
    const params: Record<string, unknown> = {
      embed: 'creator',
    };

    return this.jsonApiService
      .get<
        JsonApiResponse<CollectionSubmissionReviewActionJsonApi[], null>
      >(`${environment.apiUrl}/collection_submissions/${projectId}-${collectionId}/actions/?sort=-date_modified`, params)
      .pipe(map((response) => CollectionsMapper.fromGetCollectionSubmissionsActionsResponse(response.data)));
  }

  fetchAllUserCollectionSubmissions(
    providerId: string,
    projectIds: string[]
  ): Observable<CollectionSubmissionWithGuid[]> {
    const pendingSubmissions$ = this.fetchUserCollectionSubmissionsByStatus(providerId, projectIds, 'pending');
    const acceptedSubmissions$ = this.fetchUserCollectionSubmissionsByStatus(providerId, projectIds, 'accepted');

    return forkJoin([pendingSubmissions$, acceptedSubmissions$]).pipe(
      map(([pending, accepted]) => [...pending.data, ...accepted.data])
    );
  }

  createCollectionSubmissionAction(payload: ReviewActionPayload): Observable<ReviewActionPayloadJsonApi> {
    const params = CollectionsMapper.toReviewActionPayloadJsonApi(payload);

    return this.jsonApiService.post<ReviewActionPayloadJsonApi>(
      `${environment.apiUrl}/collection_submission_actions/`,
      params
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
  ): Observable<PaginatedData<CollectionSubmissionWithGuid[]>> {
    const params: Record<string, unknown> = {
      'filter[reviews_state]': submissionStatus,
      'filter[id]': projectIds.join(','),
    };

    return this.jsonApiService
      .get<
        JsonApiResponseWithPaging<CollectionSubmissionWithGuidJsonApi[], null>
      >(`${environment.apiUrl}/collections/${providerId}/collection_submissions/`, params)
      .pipe(
        map((response) => {
          return CollectionsMapper.fromGetCollectionSubmissionsResponse(response);
        })
      );
  }
}
