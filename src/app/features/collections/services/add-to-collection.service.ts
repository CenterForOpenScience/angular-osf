import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { CollectionsMapper } from '@osf/shared/mappers/collections';
import { LicensesMapper } from '@osf/shared/mappers/licenses.mapper';
import { JsonApiService } from '@osf/shared/services/json-api.service';
import { CollectionSubmissionPayload } from '@shared/models/collections/collection-submission-payload.model';
import { LicenseModel } from '@shared/models/license/license.model';
import { LicensesResponseJsonApi } from '@shared/models/license/licenses-json-api.model';

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

  createCollectionSubmission(payload: CollectionSubmissionPayload): Observable<void> {
    const collectionId = payload.collectionId;
    const metadata = CollectionsMapper.toCollectionSubmissionRequest(payload);

    return this.jsonApiService.post(`${this.apiUrl}/collections/${collectionId}/collection_submissions/`, metadata);
  }
}
