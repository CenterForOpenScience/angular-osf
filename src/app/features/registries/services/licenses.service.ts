import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@osf/core/services';
import { License, LicenseOptions, LicensesResponseJsonApi } from '@osf/shared/models';

import { LicensesMapper } from '../mappers';
import { RegistrationDataJsonApi, RegistrationPayloadJsonApi } from '../models';

import { environment } from 'src/environments/environment';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = {
  data: [
    {
      id: '58fd62fdda3e2400012ca5d9',
      type: 'licenses',
      attributes: {
        name: 'MIT License',
        text: 'The MIT License (MIT)\n\nCopyright (c) {{year}} {{copyrightHolders}}\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in\nall copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\nTHE SOFTWARE.\n',
        url: 'http://opensource.org/licenses/MIT',
        required_fields: ['year', 'copyrightHolders'],
      },
      links: {
        self: 'https://api.test.osf.io/v2/licenses/58fd62fdda3e2400012ca5d9/',
      },
    },
  ],
};

@Injectable()
export class LicensesService {
  private apiUrl = environment.apiUrl;
  private readonly jsonApiService = inject(JsonApiService);

  getLicenses(): Observable<License[]> {
    return this.jsonApiService
      .get<LicensesResponseJsonApi>(`${this.apiUrl}/providers/registrations/osf/licenses/`, {
        params: {
          'page[size]': 100,
        },
      })
      .pipe(
        map((licenses) => {
          licenses.data.unshift(data.data[0]); // For testing purposes, remove in production
          return LicensesMapper.fromLicensesResponse(licenses);
        })
      );
  }

  updateLicense(registrationId: string, licenseId: string, licenseOptions?: LicenseOptions) {
    const payload: RegistrationPayloadJsonApi = {
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

    return this.jsonApiService.patch<RegistrationDataJsonApi>(
      `${this.apiUrl}/draft_registrations/${registrationId}/`,
      payload
    );
  }
}
