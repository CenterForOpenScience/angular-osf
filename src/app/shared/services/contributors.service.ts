import { forkJoin, map, Observable, of } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { AddContributorType, ResourceType } from '../enums';
import { ContributorsMapper } from '../mappers';
import {
  ContributorAddModel,
  ContributorDataJsonApi,
  ContributorModel,
  ContributorResponseJsonApi,
  ContributorsResponseJsonApi,
  PaginatedData,
  ResponseJsonApi,
  UserDataJsonApi,
} from '../models';

import { JsonApiService } from './json-api.service';

@Injectable({
  providedIn: 'root',
})
export class ContributorsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Project, 'nodes'],
    [ResourceType.Registration, 'registrations'],
    [ResourceType.Preprint, 'preprints'],
    [ResourceType.DraftRegistration, 'draft_registrations'],
  ]);

  private getBaseUrl(resourceType: ResourceType, resourceId: string): string {
    const resourcePath = this.urlMap.get(resourceType);

    if (!resourcePath) {
      throw new Error(`Unsupported resource type: ${resourceType}`);
    }

    return `${this.apiUrl}/${resourcePath}/${resourceId}/contributors`;
  }

  getAllContributors(resourceType: ResourceType, resourceId: string): Observable<ContributorModel[]> {
    const baseUrl = this.getBaseUrl(resourceType, resourceId);

    return this.jsonApiService
      .get<ContributorsResponseJsonApi>(`${baseUrl}/`)
      .pipe(map((response) => ContributorsMapper.getContributors(response.data)));
  }

  getRequestAccessContributors(resourceType: ResourceType, resourceId: string): Observable<ContributorModel[]> {
    const resourcePath = this.urlMap.get(resourceType);
    const baseUrl = `${this.apiUrl}/${resourcePath}/${resourceId}/requests/`;
    const params = { 'embed[]': ['creator'] };

    return this.jsonApiService
      .get<ContributorsResponseJsonApi>(baseUrl, params)
      .pipe(map((response) => ContributorsMapper.getContributors(response.data)));
  }

  searchUsers(value: string, page = 1): Observable<PaginatedData<ContributorAddModel[]>> {
    const baseUrl = `${this.apiUrl}/users/?filter[full_name]=${value}&page=${page}`;

    return this.jsonApiService
      .get<ResponseJsonApi<UserDataJsonApi[]>>(baseUrl)
      .pipe(map((response) => ContributorsMapper.getPaginatedUsers(response)));
  }

  bulkUpdateContributors(
    resourceType: ResourceType,
    resourceId: string,
    contributors: ContributorModel[]
  ): Observable<ContributorModel[]> {
    if (contributors.length === 0) {
      return of([]);
    }

    const updateRequests = contributors.map((contributor) =>
      this.updateContributor(resourceType, resourceId, contributor)
    );

    return forkJoin(updateRequests);
  }

  updateContributor(
    resourceType: ResourceType,
    resourceId: string,
    data: ContributorModel
  ): Observable<ContributorModel> {
    const baseUrl = `${this.getBaseUrl(resourceType, resourceId)}/${data.userId}/`;

    const contributorData = { data: ContributorsMapper.toContributorAddRequest(data) };

    return this.jsonApiService
      .patch<ContributorDataJsonApi>(baseUrl, contributorData)
      .pipe(map((contributor) => ContributorsMapper.getContributor(contributor)));
  }

  bulkAddContributors(
    resourceType: ResourceType,
    resourceId: string,
    contributors: ContributorAddModel[]
  ): Observable<ContributorModel[]> {
    if (contributors.length === 0) {
      return of([]);
    }

    const addRequests = contributors.map((contributor) => this.addContributor(resourceType, resourceId, contributor));

    return forkJoin(addRequests);
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
      .post<ContributorResponseJsonApi>(baseUrl, contributorData)
      .pipe(map((contributor) => ContributorsMapper.getContributor(contributor.data)));
  }

  deleteContributor(resourceType: ResourceType, resourceId: string, userId: string): Observable<void> {
    const baseUrl = `${this.getBaseUrl(resourceType, resourceId)}/${userId}/`;

    return this.jsonApiService.delete(baseUrl);
  }
}
