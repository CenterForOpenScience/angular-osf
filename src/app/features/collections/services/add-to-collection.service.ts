import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { CollectionsMapper } from '@osf/shared/mappers/collections';
import { LicensesMapper } from '@osf/shared/mappers/licenses.mapper';
import { ReviewActionsMapper } from '@osf/shared/mappers/review-actions.mapper';
import { ReviewActionPayload } from '@osf/shared/models/review-action/review-action-payload.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';
import { CollectionSubmissionPayload } from '@shared/models/collections/collection-submission-payload.model';
import { ProviderDefaultLicense } from '@shared/models/collections/collections.model';
import { LicenseModel } from '@shared/models/license/license.model';
import {
  LicensesResponseJsonApi,
  ProviderDefaultLicenseResponseJsonApi,
} from '@shared/models/license/licenses-json-api.model';

import { RemoveCollectionSubmissionPayload } from '../models/remove-collection-submission-payload.model';

@Injectable({
  providedIn: 'root',
})
export class AddToCollectionService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  fetchCollectionLicenses(providerId: string): Observable<LicenseModel[]> {
    return this.jsonApiService
      .get<LicensesResponseJsonApi>(`${this.apiUrl}/providers/collections/${providerId}/licenses/`, {
        'page[size]': 100,
        sort: 'name',
      })
      .pipe(map((licenses) => LicensesMapper.fromLicensesResponse(licenses)));
  }

  fetchProviderDefaultLicense(providerId: string): Observable<ProviderDefaultLicense> {
    return this.jsonApiService
      .get<ProviderDefaultLicenseResponseJsonApi>(`${this.apiUrl}/providers/collections/${providerId}/`)
      .pipe(map((response) => LicensesMapper.fromProviderDefaultLicenseResponse(response)));
  }

  createCollectionSubmission(payload: CollectionSubmissionPayload): Observable<void> {
    const collectionId = payload.collectionId;
    const metadata = CollectionsMapper.toCollectionSubmissionRequest(payload);

    return this.jsonApiService.post(`${this.apiUrl}/collections/${collectionId}/collection_submissions/`, metadata);
  }

  updateCollectionSubmission(payload: CollectionSubmissionPayload): Observable<void> {
    const collectionId = payload.collectionId;
    const metadata = CollectionsMapper.collectionSubmissionUpdateRequest(payload);

    return this.jsonApiService.patch(
      `${this.apiUrl}/collections/${collectionId}/collection_submissions/${payload.projectId}/`,
      metadata
    );
  }

  removeCollectionSubmission(payload: RemoveCollectionSubmissionPayload): Observable<void> {
    const reviewActionPayload: ReviewActionPayload = {
      action: 'remove',
      targetId: `${payload.projectId}-${payload.collectionId}`,
      comment: payload.comment,
    };

    const params = ReviewActionsMapper.toReviewActionPayloadJsonApi(
      reviewActionPayload,
      'collection_submission_actions',
      'collection-submissions'
    );

    return this.jsonApiService.post<void>(`${this.apiUrl}/collection_submission_actions/`, params);
  }
}
