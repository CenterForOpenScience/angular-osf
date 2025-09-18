import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { RegistrationMapper } from '@osf/shared/mappers/registration';
import {
  CreateRegistrationPayloadJsonApi,
  DraftRegistrationDataJsonApi,
  DraftRegistrationModel,
  LicenseModel,
  LicenseOptions,
  LicensesResponseJsonApi,
} from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { LicensesMapper } from '../mappers';

@Injectable({
  providedIn: 'root',
})
export class LicensesService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly apiUrl = `${this.environment.apiDomainUrl}/v2`;

  getLicenses(providerId: string): Observable<LicenseModel[]> {
    return this.jsonApiService
      .get<LicensesResponseJsonApi>(`${this.apiUrl}/providers/registrations/${providerId}/licenses/`, {
        params: {
          'page[size]': 100,
        },
      })
      .pipe(map((licenses) => LicensesMapper.fromLicensesResponse(licenses)));
  }

  updateLicense(
    registrationId: string,
    licenseId: string,
    licenseOptions?: LicenseOptions
  ): Observable<DraftRegistrationModel> {
    const payload: CreateRegistrationPayloadJsonApi = {
      data: {
        type: 'draft_registrations',
        id: registrationId,
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
            node_license: {
              copyright_holders: [licenseOptions.copyrightHolders],
              year: licenseOptions.year,
            },
          }),
        },
      },
    };

    return this.jsonApiService
      .patch<DraftRegistrationDataJsonApi>(`${this.apiUrl}/draft_registrations/${registrationId}/`, payload)
      .pipe(map((response) => RegistrationMapper.fromDraftRegistrationResponse(response)));
  }
}
