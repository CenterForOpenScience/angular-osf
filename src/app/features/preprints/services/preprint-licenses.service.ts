import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { PreprintsMapper } from '@osf/features/preprints/mappers';
import {
  PreprintAttributesJsonApi,
  PreprintLicensePayloadJsonApi,
  PreprintLinksJsonApi,
  PreprintRelationshipsJsonApi,
} from '@osf/features/preprints/models';
import { LicensesMapper } from '@shared/mappers';
import { ApiData, License, LicenseOptions, LicensesResponseJsonApi } from '@shared/models';
import { JsonApiService } from '@shared/services';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PreprintLicensesService {
  private apiUrl = environment.apiUrl;
  private readonly jsonApiService = inject(JsonApiService);

  getLicenses(providerId: string): Observable<License[]> {
    return this.jsonApiService
      .get<LicensesResponseJsonApi>(`${this.apiUrl}/providers/preprints/${providerId}/licenses/`, {
        'page[size]': 100,
        sort: 'name',
      })
      .pipe(map((licenses) => LicensesMapper.fromLicensesResponse(licenses)));
  }

  updatePreprintLicense(preprintId: string, licenseId: string, licenseOptions?: LicenseOptions) {
    const payload: PreprintLicensePayloadJsonApi = {
      data: {
        type: 'preprints',
        id: preprintId,
        relationships: {
          license: {
            data: {
              id: licenseId,
              type: 'licenses',
            },
          },
        },
        attributes: {
          ...(licenseOptions && {
            license_record: {
              copyright_holders: [licenseOptions.copyrightHolders],
              year: licenseOptions.year,
            },
          }),
        },
      },
    };

    return this.jsonApiService
      .patch<
        ApiData<PreprintAttributesJsonApi, null, PreprintRelationshipsJsonApi, PreprintLinksJsonApi>
      >(`${this.apiUrl}/preprints/${preprintId}/`, payload)
      .pipe(map((response) => PreprintsMapper.fromPreprintJsonApi(response)));
  }
}
