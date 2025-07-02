import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse, JsonApiResponseWithPaging, UserGetResponse } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';
import { PaginatedData } from '@osf/shared/models';

import { AddContributorType } from '../enums';
import { ContributorsMapper } from '../mappers';
import { ContributorAddModel, ContributorModel, ContributorResponse } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContributorsService {
  #jsonApiService = inject(JsonApiService);

  getAllContributors(projectId: string): Observable<ContributorModel[]> {
    const baseUrl = `${environment.apiUrl}/nodes/${projectId}/contributors`;

    return this.#jsonApiService
      .get<JsonApiResponse<ContributorResponse[], null>>(baseUrl)
      .pipe(map((response) => ContributorsMapper.fromResponse(response.data)));
  }

  searchUsers(value: string, page = 1): Observable<PaginatedData<ContributorAddModel[]>> {
    const baseUrl = `${environment.apiUrl}/users/?filter[full_name]=${value}&page=${page}`;

    return this.#jsonApiService
      .get<JsonApiResponseWithPaging<UserGetResponse[], null>>(baseUrl)
      .pipe(map((response) => ContributorsMapper.fromUsersWithPaginationGetResponse(response)));
  }

  addContributor(projectId: string, data: ContributorAddModel): Observable<ContributorModel> {
    const baseUrl = `${environment.apiUrl}/nodes/${projectId}/contributors/`;
    const type = data.id ? AddContributorType.Registered : AddContributorType.Unregistered;

    const contributorData = { data: ContributorsMapper.toContributorAddRequest(data, type) };

    return this.#jsonApiService
      .post<JsonApiResponse<ContributorResponse, null>>(baseUrl, contributorData)
      .pipe(map((contributor) => ContributorsMapper.fromContributorResponse(contributor.data)));
  }

  updateContributor(projectId: string, data: ContributorModel): Observable<ContributorModel> {
    const baseUrl = `${environment.apiUrl}/nodes/${projectId}/contributors/${data.userId}`;

    const contributorData = { data: ContributorsMapper.toContributorAddRequest(data) };

    return this.#jsonApiService
      .patch<ContributorResponse>(baseUrl, contributorData)
      .pipe(map((contributor) => ContributorsMapper.fromContributorResponse(contributor)));
  }

  deleteContributor(projectId: string, userId: string): Observable<void> {
    const baseUrl = `${environment.apiUrl}/nodes/${projectId}/contributors/${userId}`;

    return this.#jsonApiService.delete(baseUrl);
  }
}
