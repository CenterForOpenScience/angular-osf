import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services';
import { LicensesMapper } from '@shared/mappers';
import { License, LicensesResponseJsonApi } from '@shared/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CollectionLicensesService {
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

  // updateCollectionLicense(collectionId: string, licenseId: string, licenseOptions?: LicenseOptions) {
  //   const payload: CollectionLicensePayloadJsonApi = {
  //     data: {
  //       type: 'preprints',
  //       id: preprintId,
  //       relationships: {
  //         license: {
  //           data: {
  //             id: licenseId,
  //             type: 'licenses',
  //           },
  //         },
  //       },
  //       attributes: {
  //         ...(licenseOptions && {
  //           license_record: {
  //             copyright_holders: [licenseOptions.copyrightHolders],
  //             year: licenseOptions.year,
  //           },
  //         }),
  //       },
  //     },
  //   };
  //
  //   return this.jsonApiService
  //     .patch<
  //       ApiData<PreprintJsonApi, null, PreprintsRelationshipsJsonApi, null>
  //     >(`${this.apiUrl}/preprints/${preprintId}/`, payload)
  //     .pipe(map((response) => PreprintsMapper.fromPreprintJsonApi(response)));
  // }
}
