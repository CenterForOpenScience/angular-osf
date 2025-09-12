import { map, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { LicensesMapper } from '@shared/mappers';
import { LicenseModel, LicensesResponseJsonApi } from '@shared/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LicensesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiDomainUrl}/v2`;

  getAllLicenses(): Observable<LicenseModel[]> {
    return this.http
      .get<LicensesResponseJsonApi>(`${this.apiUrl}/licenses/?page[size]=20`)
      .pipe(map((licenses) => LicensesMapper.fromLicensesResponse(licenses)));
  }
}
