import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { CollectionsMapper } from '@osf/features/collections/mappers';
import { CollectionSubmissionPayload } from '@osf/features/collections/models';
import { LicensesMapper } from '@shared/mappers';
import { License, LicensesResponseJsonApi } from '@shared/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddToCollectionService {
  private apiUrl = environment.apiUrl;
  private readonly jsonApiService = inject(JsonApiService);

  fetchCollectionLicenses(providerId: string): Observable<License[]> {
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
