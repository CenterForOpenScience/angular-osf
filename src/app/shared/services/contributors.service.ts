import { map, Observable, of } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { AddContributorType } from '../enums/contributors/add-contributor-type.enum';
import { ResourceType } from '../enums/resource-type.enum';
import { ContributorsMapper } from '../mappers/contributors';
import { ResponseJsonApi } from '../models/common/json-api.model';
import { ContributorModel } from '../models/contributors/contributor.model';
import { ContributorAddModel } from '../models/contributors/contributor-add.model';
import { ContributorsResponseJsonApi } from '../models/contributors/contributor-response-json-api.model';
import { PaginatedData } from '../models/paginated-data.model';
import { UserDataJsonApi } from '../models/user/user-json-api.model';

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

  private getBaseUrl(resourceType: ResourceType, resourceId: string, isBibliographic = false): string {
    const resourcePath = this.urlMap.get(resourceType);

    if (!resourcePath) {
      throw new Error(`Unsupported resource type: ${resourceType}`);
    }

    const contributorsUrl = isBibliographic ? 'bibliographic_contributors' : 'contributors';

    return `${this.apiUrl}/${resourcePath}/${resourceId}/${contributorsUrl}`;
  }

  getAllContributors(
    resourceType: ResourceType,
    resourceId: string,
    page: number,
    pageSize: number
  ): Observable<PaginatedData<ContributorModel[]>> {
    const baseUrl = this.getBaseUrl(resourceType, resourceId);

    const params = {
      page: page,
      'page[size]': pageSize,
    };

    return this.jsonApiService.get<ContributorsResponseJsonApi>(`${baseUrl}/`, params).pipe(
      map((response) => ({
        data: ContributorsMapper.getContributors(response.data),
        totalCount: response.meta.total,
        pageSize: response.meta.per_page,
      }))
    );
  }

  getBibliographicContributors(
    resourceType: ResourceType,
    resourceId: string,
    page: number,
    pageSize: number
  ): Observable<PaginatedData<ContributorModel[]>> {
    const baseUrl = this.getBaseUrl(resourceType, resourceId, true);

    const params = {
      page: page,
      'page[size]': pageSize,
    };

    return this.jsonApiService.get<ContributorsResponseJsonApi>(`${baseUrl}/`, params).pipe(
      map((response) => ({
        data: ContributorsMapper.getContributors(response.data),
        totalCount: response.meta.total,
        pageSize: response.meta.per_page,
      }))
    );
  }

  searchUsers(value: string, page = 1): Observable<PaginatedData<ContributorAddModel[]>> {
    const baseUrl = `${this.apiUrl}/search/users/?q=${value}*&page=${page}`;
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

    const baseUrl = `${this.getBaseUrl(resourceType, resourceId)}/`;

    const contributorData = {
      data: contributors.map((contributor) => ContributorsMapper.toContributorUpdateRequest(contributor)),
    };

    const headers = {
      'Content-Type': 'application/vnd.api+json; ext=bulk',
    };

    return this.jsonApiService
      .patch<ContributorsResponseJsonApi>(baseUrl, contributorData, undefined, headers)
      .pipe(map((response) => ContributorsMapper.getContributors(response.data)));
  }

  bulkAddContributors(
    resourceType: ResourceType,
    resourceId: string,
    contributors: ContributorAddModel[],
    childNodeIds?: string[]
  ): Observable<ContributorModel[]> {
    if (contributors.length === 0) {
      return of([]);
    }

    const baseUrl = `${this.getBaseUrl(resourceType, resourceId)}/`;

    const contributorData = {
      data: contributors.map((contributor) => {
        const type = contributor.id ? AddContributorType.Registered : AddContributorType.Unregistered;
        return ContributorsMapper.toContributorAddRequest(contributor, type, childNodeIds);
      }),
    };

    const headers = {
      'Content-Type': 'application/vnd.api+json; ext=bulk',
    };

    return this.jsonApiService
      .post<ContributorsResponseJsonApi>(baseUrl, contributorData, undefined, headers)
      .pipe(map((response) => ContributorsMapper.getContributors(response.data)));
  }

  addContributorsFromProject(resourceType: ResourceType, resourceId: string): Observable<void> {
    const baseUrl = `${this.getBaseUrl(resourceType, resourceId)}/?copy_contributors_from_parent_project=true`;
    const contributorData = { data: { type: AddContributorType.ParentProject } };
    return this.jsonApiService.patch(baseUrl, contributorData);
  }

  deleteContributor(resourceType: ResourceType, resourceId: string, userId: string): Observable<void> {
    const baseUrl = `${this.getBaseUrl(resourceType, resourceId)}/${userId}/`;

    return this.jsonApiService.delete(baseUrl);
  }
}
