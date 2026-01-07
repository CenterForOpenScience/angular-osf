import { forkJoin, map, Observable, of } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { AddContributorType } from '../enums/contributors/add-contributor-type.enum';
import { ContributorPermission } from '../enums/contributors/contributor-permission.enum';
import { ResourceType } from '../enums/resource-type.enum';
import { parseSearchTotalCount } from '../helpers/search-total-count.helper';
import { ContributorsMapper } from '../mappers/contributors';
import { MapResources } from '../mappers/search';
import { ContributorModel } from '../models/contributors/contributor.model';
import { ContributorAddModel } from '../models/contributors/contributor-add.model';
import { ContributorsResponseJsonApi } from '../models/contributors/contributor-response-json-api.model';
import { PaginatedData } from '../models/paginated-data.model';
import { IndexCardSearchResponseJsonApi } from '../models/search/index-card-search-json-api.models';
import { SearchUserDataModel } from '../models/user/search-user-data.model';

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

  get shareTroveUrl() {
    return this.environment.shareTroveUrl;
  }

  get webUrl() {
    return this.environment.webUrl;
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

  searchUsers(value: string, pageSize = 10): Observable<SearchUserDataModel<ContributorAddModel[]>> {
    if (value.length === 5) {
      return forkJoin([this.searchUsersByName(value, pageSize), this.searchUsersById(value, pageSize)]).pipe(
        map(([nameResults, idResults]) => {
          const users = [...nameResults.users];
          const existingIds = new Set(users.map((u) => u.id));

          idResults.users.forEach((user) => {
            if (!existingIds.has(user.id)) {
              users.push(user);
              existingIds.add(user.id);
            }
          });

          return {
            users,
            totalCount: nameResults.totalCount + idResults.totalCount,
            next: nameResults.next,
            previous: nameResults.previous,
          };
        })
      );
    } else {
      return this.searchUsersByName(value, pageSize);
    }
  }

  searchUsersByName(value: string, pageSize = 10): Observable<SearchUserDataModel<ContributorAddModel[]>> {
    const baseUrl = `${this.shareTroveUrl}/index-card-search`;
    const params = {
      'cardSearchFilter[resourceType]': 'Person',
      'cardSearchFilter[accessService]': this.webUrl,
      'cardSearchText[name]': `${value}*`,
      acceptMediatype: 'application/vnd.api+json',
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<IndexCardSearchResponseJsonApi>(baseUrl, params)
      .pipe(map((response) => this.handleResourcesRawResponse(response)));
  }

  searchUsersById(value: string, pageSize = 10): Observable<SearchUserDataModel<ContributorAddModel[]>> {
    const baseUrl = `${this.shareTroveUrl}/index-card-search`;
    const params = {
      'cardSearchFilter[resourceType]': 'Person',
      'cardSearchFilter[accessService]': this.webUrl,
      'cardSearchFilter[sameAs]': `${this.webUrl}/${value}`,
      acceptMediatype: 'application/vnd.api+json',
      'page[size]': pageSize,
    };

    return this.jsonApiService
      .get<IndexCardSearchResponseJsonApi>(baseUrl, params)
      .pipe(map((response) => this.handleResourcesRawResponse(response)));
  }

  getUsersByLink(link: string): Observable<SearchUserDataModel<ContributorAddModel[]>> {
    return this.jsonApiService
      .get<IndexCardSearchResponseJsonApi>(link)
      .pipe(map((response) => this.handleResourcesRawResponse(response)));
  }

  private handleResourcesRawResponse(
    response: IndexCardSearchResponseJsonApi
  ): SearchUserDataModel<ContributorAddModel[]> {
    const users = MapResources(response).map(
      (user) =>
        ({
          id: user.absoluteUrl.split('/').pop(),
          fullName: user.name,
          permission: ContributorPermission.Write,
        }) as ContributorAddModel
    );

    return {
      users,
      totalCount: parseSearchTotalCount(response),
      next: response.data?.relationships?.searchResultPage.links?.next?.href ?? null,
      previous: response.data?.relationships?.searchResultPage.links?.prev?.href ?? null,
    };
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

  deleteContributor(
    resourceType: ResourceType,
    resourceId: string,
    userId: string,
    removeFromChildren = false
  ): Observable<void> {
    let baseUrl = `${this.getBaseUrl(resourceType, resourceId)}/${userId}/`;
    if (removeFromChildren) {
      baseUrl = baseUrl.concat('?propagate_to_children=true');
    }

    return this.jsonApiService.delete(baseUrl);
  }
}
