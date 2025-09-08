import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { CollectionsMapper, LicensesMapper } from '@shared/mappers';
import { CollectionSubmissionPayload, LicenseModel, LicensesResponseJsonApi } from '@shared/models';
import { JsonApiService } from '@shared/services';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddToCollectionService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly apiUrl = `${environment.apiDomainUrl}/v2`;

  fetchCollectionLicenses(providerId: string): Observable<LicenseModel[]> {
    return this.jsonApiService
      .get<LicensesResponseJsonApi>(`${this.apiUrl}/providers/collections/${providerId}/licenses/`, {
        'page[size]': 100,
        sort: 'name',
      })
      .pipe(map((licenses) => LicensesMapper.fromLicensesResponse(licenses)));
  }

  createCollectionSubmission(payload: CollectionSubmissionPayload): Observable<void> {
    const collectionId = payload.collectionId;
    const metadata = CollectionsMapper.toCollectionSubmissionRequest(payload);

    return this.jsonApiService.post(`${this.apiUrl}/collections/${collectionId}/collection_submissions/`, metadata);
  }
}
