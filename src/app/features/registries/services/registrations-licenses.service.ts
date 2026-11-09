import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { RegistrationMapper } from '@osf/shared/mappers/registration';
import { LicenseOptions } from '@osf/shared/models/license/license.model';
import { DraftRegistrationModel } from '@osf/shared/models/registration/draft-registration.model';
import {
  CreateRegistrationPayloadJsonApi,
  DraftRegistrationDataJsonApi,
} from '@osf/shared/models/registration/registration-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrationsLicenseService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
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
          node_license: licenseOptions
            ? {
                copyright_holders: [licenseOptions.copyrightHolders],
                year: licenseOptions.year,
              }
            : {
                copyright_holders: [],
                year: '',
              },
        },
      },
    };

    return this.jsonApiService
      .patch<DraftRegistrationDataJsonApi>(`${this.apiUrl}/draft_registrations/${registrationId}/`, payload)
      .pipe(map((response) => RegistrationMapper.fromDraftRegistrationResponse(response)));
  }
}
