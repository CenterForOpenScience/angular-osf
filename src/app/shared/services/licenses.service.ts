import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { LicensesMapper } from '../mappers/licenses.mapper';
import { LicenseModel } from '../models/license/license.model';
import { LicenseResponseJsonApi, LicensesResponseJsonApi } from '../models/license/licenses-json-api.model';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class LicensesService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getLicenses(licensesUrl: string): Observable<LicenseModel[]> {
    const params: Record<string, unknown> = {
      'page[size]': 100,
      sort: 'name',
    };

    return this.jsonApiService
      .get<LicensesResponseJsonApi>(licensesUrl, params)
      .pipe(map((licenses) => LicensesMapper.fromLicensesResponse(licenses)));
  }

  getLicenseById(licenseId: string): Observable<LicenseModel | null> {
    return this.jsonApiService
      .get<LicenseResponseJsonApi>(`${this.apiUrl}/licenses/${licenseId}/`)
      .pipe(map((response) => LicensesMapper.fromLicenseDataJsonApi(response.data)));
  }
}
