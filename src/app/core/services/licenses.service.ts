import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { LicensesResponseJsonApi } from '@shared/models/license.model';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LicensesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAllLicenses(): Observable<LicensesResponseJsonApi> {
    return this.http.get<LicensesResponseJsonApi>(`${this.baseUrl}/licenses/?page[size]=20`);
  }
}
