import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@core/models';
import { JsonApiService } from '@core/services';
import { AddContributorType } from '@shared/components/contributors/enums';
import { ContributorsMapper } from '@shared/components/contributors/mappers';
import { ContributorAddModel, ContributorModel, ContributorResponse } from '@shared/components/contributors/models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PreprintContributorsService {
  private jsonApiService = inject(JsonApiService);
  private apiUrl = environment.apiUrl;

  getContributors(preprintId: string): Observable<ContributorModel[]> {
    return this.jsonApiService
      .get<JsonApiResponse<ContributorResponse[], null>>(`${this.apiUrl}/preprints/${preprintId}/contributors/`)
      .pipe(map((contributors) => ContributorsMapper.fromResponse(contributors.data)));
  }

  addContributor(preprintId: string, data: ContributorAddModel): Observable<ContributorModel> {
    const baseUrl = `${this.apiUrl}/preprints/${preprintId}/contributors/`;
    const type = data.id ? AddContributorType.Registered : AddContributorType.Unregistered;

    const contributorData = { data: ContributorsMapper.toContributorAddRequest(data, type) };

    return this.jsonApiService
      .post<JsonApiResponse<ContributorResponse, null>>(baseUrl, contributorData)
      .pipe(map((contributor) => ContributorsMapper.fromContributorResponse(contributor.data)));
  }

  updateContributor(preprintId: string, data: ContributorModel): Observable<ContributorModel> {
    const baseUrl = `${environment.apiUrl}/preprints/${preprintId}/contributors/${data.userId}`;

    const contributorData = { data: ContributorsMapper.toContributorAddRequest(data) };

    return this.jsonApiService
      .patch<ContributorResponse>(baseUrl, contributorData)
      .pipe(map((contributor) => ContributorsMapper.fromContributorResponse(contributor)));
  }

  deleteContributor(preprintId: string, contributorId: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/preprints/${preprintId}/contributors/${contributorId}`);
  }
}
