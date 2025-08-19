import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { inject, Injectable } from '@angular/core';

import { GeneralInstitutionMapper, UserInstitutionsMapper } from '@shared/mappers';
import {
  FetchInstitutionsJsonApi,
  GetGeneralInstitutionsResponse,
  Institution,
  InstitutionJsonApiModel,
  JsonApiResponse,
  UserInstitutionGetResponse,
} from '@shared/models';
import { JsonApiService } from '@shared/services';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InstitutionsService {
  private readonly jsonApiService = inject(JsonApiService);

  getInstitutions(
    pageNumber: number,
    pageSize: number,
    searchValue?: string
  ): Observable<GetGeneralInstitutionsResponse> {
    const params: Record<string, unknown> = {};

    if (pageNumber) {
      params['page'] = pageNumber;
    }

    if (pageSize) {
      params['page[size]'] = pageSize;
    }

    if (searchValue && searchValue.trim()) {
      params['filter[name]'] = searchValue.trim();
    }

    return this.jsonApiService
      .get<FetchInstitutionsJsonApi>(`${environment.apiUrl}/institutions`, params)
      .pipe(map((response) => GeneralInstitutionMapper.adaptInstitutions(response)));
  }

  getUserInstitutions(): Observable<Institution[]> {
    const url = `${environment.apiUrl}/users/me/institutions/`;

    return this.jsonApiService
      .get<JsonApiResponse<UserInstitutionGetResponse[], null>>(url)
      .pipe(map((response) => response.data.map((item) => UserInstitutionsMapper.fromResponse(item))));
  }

  getInstitutionById(institutionId: string): Observable<Institution> {
    return this.jsonApiService
      .get<InstitutionJsonApiModel>(`${environment.apiUrl}/institutions/${institutionId}`)
      .pipe(map((result) => result.data.attributes));
  }

  deleteUserInstitution(id: string, userId: string): Observable<void> {
    const payload = {
      data: [{ id: id, type: 'institutions' }],
    };
    return this.jsonApiService.delete(`${environment.apiUrl}/users/${userId}/relationships/institutions/`, payload);
  }
}
