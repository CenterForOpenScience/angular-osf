import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { LicensesApiResponse } from '@shared/models/license.model';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LicensesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAllLicenses(): Observable<LicensesApiResponse> {
    return this.http.get<LicensesApiResponse>(`${this.baseUrl}/licenses/?page[size]=20`);
  }
}
