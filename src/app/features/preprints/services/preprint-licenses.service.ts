import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { PreprintsMapper } from '@osf/features/preprints/mappers';
import { PreprintDataJsonApi } from '@osf/shared/models/preprints/preprint-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';
import { LicensesMapper } from '@shared/mappers/licenses.mapper';
import { LicenseModel, LicenseOptions } from '@shared/models/license/license.model';
import { LicensesResponseJsonApi } from '@shared/models/license/licenses-json-api.model';

import { PreprintLicensePayloadJsonApi } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PreprintLicensesService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getLicenses(providerId: string): Observable<LicenseModel[]> {
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
      .patch<PreprintDataJsonApi>(`${this.apiUrl}/preprints/${preprintId}/`, payload)
      .pipe(map((response) => PreprintsMapper.fromPreprintJsonApi(response)));
  }
}
