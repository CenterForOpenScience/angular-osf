import { map, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { LicensesMapper } from '@shared/mappers';
import { License, LicensesResponseJsonApi } from '@shared/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LicensesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiDomainUrl;

  getAllLicenses(): Observable<License[]> {
    return this.http
      .get<LicensesResponseJsonApi>(`${this.baseUrl}/licenses/?page[size]=20`)
      .pipe(map((licenses) => LicensesMapper.fromLicensesResponse(licenses)));
  }
}
