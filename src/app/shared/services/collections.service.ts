import { forkJoin, map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@osf/core/provider/environment.provider';
import {
  CollectionSubmissionReviewAction,
  CollectionSubmissionReviewActionsListResponseJsonApi,
} from '@osf/features/moderation/models';

import { CollectionsMapper } from '../mappers/collections';
import { ReviewActionsMapper } from '../mappers/review-actions.mapper';
import { CollectionDetails } from '../models/collections/collection-details.model';
import { CollectionDetailsListResponseJsonApi } from '../models/collections/collection-details-json-api.model';
import { CollectionProvider } from '../models/collections/collection-provider.model';
import { CollectionProviderGetResponseJsonApi } from '../models/collections/collection-provider-json-api.model';
import {
  CollectionProjectSubmission,
  CollectionSubmission,
  CollectionSubmissionActionType,
  CollectionSubmissionTargetType,
  CollectionSubmissionWithGuid,
} from '../models/collections/collection-submissions.model';
import {
  CollectionSubmissionJsonApi,
  CollectionSubmissionWithGuidListResponseJsonApi,
  CollectionSubmissionWithGuidResponseJsonApi,
} from '../models/collections/collection-submissions-json-api.model';
import { PaginatedData } from '../models/paginated-data.model';
import { ReviewActionPayload } from '../models/review-action/review-action-payload.model';
import { ReviewActionPayloadJsonApi } from '../models/review-action/review-action-payload-json-api.model';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getCollectionProvider(collectionName: string): Observable<CollectionProvider> {
    const url = `${this.apiUrl}/providers/collections/${collectionName}/?embed=brand&embed=required_metadata_template`;

    return this.jsonApiService
      .get<CollectionProviderGetResponseJsonApi>(url)
      .pipe(map((response) => CollectionsMapper.fromGetCollectionProviderResponse(response.data)));
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
      .get<CollectionSubmissionWithGuidListResponseJsonApi>(
        `${this.apiUrl}/collections/${collectionId}/collection_submissions/`,
        params
      )
      .pipe(map((response) => CollectionsMapper.fromGetCollectionSubmissionsResponse(response)));
  }

  fetchProjectCollections(projectId: string, isPublic: boolean, bookmarks: boolean): Observable<CollectionDetails[]> {
    const params: Record<string, boolean> = {
      'filter[is_public]': isPublic,
      'filter[bookmarks]': bookmarks,
    };

    return this.jsonApiService
      .get<CollectionDetailsListResponseJsonApi>(`${this.apiUrl}/nodes/${projectId}/collections/`, params)
      .pipe(
        map((response) =>
          response.data.map((collection) => CollectionsMapper.fromGetCollectionDetailsResponse(collection))
        )
      );
  }

  fetchCurrentSubmission(projectId: string, collectionId: string): Observable<CollectionSubmission> {
    const params: Record<string, string> = { embed: 'collection' };

    return this.jsonApiService
      .get<CollectionSubmissionJsonApi>(
        `${this.apiUrl}/collections/${collectionId}/collection_submissions/${projectId}/`,
        params
      )
      .pipe(map((response) => CollectionsMapper.fromCurrentSubmissionResponse(response.data)));
  }

  fetchProjectSubmission(collectionId: string, projectId: string): Observable<CollectionProjectSubmission> {
    return this.jsonApiService
      .get<CollectionSubmissionWithGuidResponseJsonApi>(
        `${this.apiUrl}/collections/${collectionId}/collection_submissions/${projectId}/`
      )
      .pipe(map((response) => CollectionsMapper.getProjectSubmission(response.data)));
  }

  fetchCollectionSubmissionsActions(
    projectId: string,
    collectionId: string
  ): Observable<CollectionSubmissionReviewAction[]> {
    const params: Record<string, unknown> = {
      embed: 'creator',
    };

    return this.jsonApiService
      .get<CollectionSubmissionReviewActionsListResponseJsonApi>(
        `${this.apiUrl}/collection_submissions/${projectId}-${collectionId}/actions/?sort=-date_modified`,
        params
      )
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

  createCollectionSubmissionAction(
    payload: ReviewActionPayload
  ): Observable<ReviewActionPayloadJsonApi<CollectionSubmissionActionType, CollectionSubmissionTargetType>> {
    const params = ReviewActionsMapper.toReviewActionPayloadJsonApi(
      payload,
      'collection_submission_actions',
      'collection-submissions'
    );

    return this.jsonApiService.post<
      ReviewActionPayloadJsonApi<CollectionSubmissionActionType, CollectionSubmissionTargetType>
    >(`${this.apiUrl}/collection_submission_actions/`, params);
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
      .get<CollectionSubmissionWithGuidListResponseJsonApi>(
        `${this.apiUrl}/collections/${providerId}/collection_submissions/`,
        params
      )
      .pipe(map((response) => CollectionsMapper.fromGetCollectionSubmissionsResponse(response)));
  }
}
