import { map, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { LicensesMapper } from '../mappers/licenses.mapper';
import { LicenseModel } from '../models/license/license.model';
import { LicensesResponseJsonApi } from '../models/license/licenses-json-api.model';

@Injectable({
  providedIn: 'root',
})
export class LicensesService {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getAllLicenses(): Observable<LicenseModel[]> {
    return this.http
      .get<LicensesResponseJsonApi>(`${this.apiUrl}/licenses/?page[size]=20`)
      .pipe(map((licenses) => LicensesMapper.fromLicensesResponse(licenses)));
  }
}
