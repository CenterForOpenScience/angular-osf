import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { AddContributorType, ResourceType } from '../enums';
import { ContributorsMapper } from '../mappers';
import {
  ContributorAddModel,
  ContributorModel,
  ContributorResponse,
  JsonApiResponse,
  PaginatedData,
  ResponseJsonApi,
  UserGetResponse,
} from '../models';

import { JsonApiService } from './json-api.service';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContributorsService {
  private readonly jsonApiService = inject(JsonApiService);

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
    [ResourceType.Preprint, 'preprints'],
    [ResourceType.DraftRegistration, 'draft_registrations'],
  ]);

  private getBaseUrl(resourceType: ResourceType, resourceId: string): string {
    const baseUrl = `${environment.apiUrl}`;
    const resourcePath = this.urlMap.get(resourceType);

    if (!resourcePath) {
      throw new Error(`Unsupported resource type: ${resourceType}`);
    }

    return `${baseUrl}/${resourcePath}/${resourceId}/contributors`;
  }

  getAllContributors(resourceType: ResourceType, resourceId: string): Observable<ContributorModel[]> {
    const baseUrl = this.getBaseUrl(resourceType, resourceId);

    return this.jsonApiService
      .get<JsonApiResponse<ContributorResponse[], null>>(`${baseUrl}/`)
      .pipe(map((response) => ContributorsMapper.fromResponse(response.data)));
  }

  searchUsers(value: string, page = 1): Observable<PaginatedData<ContributorAddModel[]>> {
    const baseUrl = `${environment.apiUrl}/users/?filter[full_name]=${value}&page=${page}`;

    return this.jsonApiService
      .get<ResponseJsonApi<UserGetResponse[]>>(baseUrl)
      .pipe(map((response) => ContributorsMapper.fromUsersWithPaginationGetResponse(response)));
  }

  addContributor(
    resourceType: ResourceType,
    resourceId: string,
    data: ContributorAddModel
  ): Observable<ContributorModel> {
    const baseUrl = `${this.getBaseUrl(resourceType, resourceId)}/`;
    const type = data.id ? AddContributorType.Registered : AddContributorType.Unregistered;

    const contributorData = { data: ContributorsMapper.toContributorAddRequest(data, type) };

    return this.jsonApiService
      .post<JsonApiResponse<ContributorResponse, null>>(baseUrl, contributorData)
      .pipe(map((contributor) => ContributorsMapper.fromContributorResponse(contributor.data)));
  }

  updateContributor(
    resourceType: ResourceType,
    resourceId: string,
    data: ContributorModel
  ): Observable<ContributorModel> {
    const baseUrl = `${this.getBaseUrl(resourceType, resourceId)}/${data.userId}/`;

    const contributorData = { data: ContributorsMapper.toContributorAddRequest(data) };

    return this.jsonApiService
      .patch<ContributorResponse>(baseUrl, contributorData)
      .pipe(map((contributor) => ContributorsMapper.fromContributorResponse(contributor)));
  }

  deleteContributor(resourceType: ResourceType, resourceId: string, userId: string): Observable<void> {
    const baseUrl = `${this.getBaseUrl(resourceType, resourceId)}/${userId}/`;

    return this.jsonApiService.delete(baseUrl);
  }
}
