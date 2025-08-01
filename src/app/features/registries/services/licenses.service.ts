import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';
import { RegistrationMapper } from '@osf/shared/mappers/registration';
import {
  CreateRegistrationPayloadJsonApi,
  DraftRegistrationDataJsonApi,
  DraftRegistrationModel,
  License,
  LicenseOptions,
  LicensesResponseJsonApi,
} from '@osf/shared/models';

import { LicensesMapper } from '../mappers';

import { environment } from 'src/environments/environment';

@Injectable()
export class LicensesService {
  private apiUrl = environment.apiUrl;
  private readonly jsonApiService = inject(JsonApiService);

  getLicenses(providerId: string): Observable<License[]> {
    return this.jsonApiService
      .get<LicensesResponseJsonApi>(`${this.apiUrl}/providers/registrations/${providerId}/licenses/`, {
        params: {
          'page[size]': 100,
        },
      })
      .pipe(
        map((licenses) => {
          return LicensesMapper.fromLicensesResponse(licenses);
        })
      );
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
