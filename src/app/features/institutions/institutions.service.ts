import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@core/services/json-api/json-api.entity';
import { JsonApiService } from '@core/services/json-api/json-api.service';

import { environment } from '../../../environments/environment';

import { Institution, UserInstitutionGetResponse } from './entities/institutions.models';
import { InstitutionsMapper } from './mappers/institutions.mapper';

@Injectable({
  providedIn: 'root',
})
export class InstitutionsService {
  #baseUrl = 'https://api.staging4.osf.io/v2/';
  #jsonApiService = inject(JsonApiService);

  getUserInstitutions(): Observable<Institution[]> {
    const url = this.#baseUrl + 'users/me/institutions/';
    // const url = this.#baseUrl + 'users/26c59/institutions/';
    return this.#jsonApiService
      .get<JsonApiResponse<UserInstitutionGetResponse[], null>>(url)
      .pipe(map((response) => response.data.map((item) => InstitutionsMapper.fromResponse(item))));
  }

  deleteUserInstitution(id: string, userId: string): Observable<void> {
    const payload = {
      data: [{ id: id, type: 'institutions' }],
    };
    return this.#jsonApiService.delete(`${environment.apiUrl}/users/${userId}/relationships/institutions/`, payload);
  }
}
