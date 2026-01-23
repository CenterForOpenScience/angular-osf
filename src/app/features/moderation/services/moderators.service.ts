import { forkJoin, map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { parseSearchTotalCount } from '@osf/shared/helpers/search-total-count.helper';
import { MapResources } from '@osf/shared/mappers/search';
import { JsonApiResponse } from '@osf/shared/models/common/json-api.model';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';
import { IndexCardSearchResponseJsonApi } from '@osf/shared/models/search/index-card-search-json-api.models';
import { SearchUserDataModel } from '@osf/shared/models/user/search-user-data.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';
import { StringOrNull } from '@shared/helpers/types.helper';

import { AddModeratorType, ModeratorPermission } from '../enums';
import { ModerationMapper } from '../mappers';
import { ModeratorAddModel, ModeratorDataJsonApi, ModeratorModel, ModeratorResponseJsonApi } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ModeratorsService {
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
    [ResourceType.Collection, 'providers/collections'],
    [ResourceType.Registration, 'providers/registrations'],
    [ResourceType.Preprint, 'providers/preprints'],
  ]);

  getModerators(
    resourceId: string,
    resourceType: ResourceType,
    searchValue: StringOrNull,
    page: number,
    pageSize: number
  ): Observable<PaginatedData<ModeratorModel[]>> {
    const baseUrl = `${this.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/moderators/`;

    const params: Record<string, string> = {
      page: page.toString(),
      'page[size]': pageSize.toString(),
    };

    if (searchValue) {
      params['filter[full_name]'] = searchValue;
    }

    return this.jsonApiService.get<ModeratorResponseJsonApi>(baseUrl, params).pipe(
      map((response) => ({
        data: ModerationMapper.getModerators(response.data),
        totalCount: response.meta.total,
        pageSize: response.meta.per_page,
      }))
    );
  }

  addModerator(resourceId: string, resourceType: ResourceType, data: ModeratorAddModel): Observable<ModeratorModel> {
    const baseUrl = `${this.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/moderators/`;
    const type = data.id ? AddModeratorType.Search : AddModeratorType.Invite;

    const moderatorData = { data: ModerationMapper.toModeratorAddRequest(data, type) };

    return this.jsonApiService
      .post<JsonApiResponse<ModeratorDataJsonApi, null>>(baseUrl, moderatorData)
      .pipe(map((moderator) => ModerationMapper.fromModeratorResponse(moderator.data)));
  }

  updateModerator(resourceId: string, resourceType: ResourceType, data: ModeratorAddModel): Observable<ModeratorModel> {
    const baseUrl = `${this.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/moderators/${data.id}`;
    const moderatorData = { data: ModerationMapper.toModeratorAddRequest(data) };

    return this.jsonApiService
      .patch<ModeratorDataJsonApi>(baseUrl, moderatorData)
      .pipe(map((moderator) => ModerationMapper.fromModeratorResponse(moderator)));
  }

  deleteModerator(resourceId: string, resourceType: ResourceType, userId: string): Observable<void> {
    const baseUrl = `${this.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/moderators/${userId}`;

    return this.jsonApiService.delete(baseUrl);
  }

  searchUsers(value: string, pageSize = 10): Observable<SearchUserDataModel<ModeratorAddModel[]>> {
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

  searchUsersByName(value: string, pageSize = 10): Observable<SearchUserDataModel<ModeratorAddModel[]>> {
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

  searchUsersById(value: string, pageSize = 10): Observable<SearchUserDataModel<ModeratorAddModel[]>> {
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

  getUsersByLink(link: string): Observable<SearchUserDataModel<ModeratorAddModel[]>> {
    return this.jsonApiService
      .get<IndexCardSearchResponseJsonApi>(link)
      .pipe(map((response) => this.handleResourcesRawResponse(response)));
  }

  private handleResourcesRawResponse(
    response: IndexCardSearchResponseJsonApi
  ): SearchUserDataModel<ModeratorAddModel[]> {
    const users = MapResources(response).map(
      (user) =>
        ({
          id: user.absoluteUrl.split('/').pop(),
          fullName: user.name,
          permission: ModeratorPermission.Moderator,
        }) as ModeratorAddModel
    );

    return {
      users,
      totalCount: parseSearchTotalCount(response),
      next: response.data?.relationships?.searchResultPage.links?.next?.href ?? null,
      previous: response.data?.relationships?.searchResultPage.links?.prev?.href ?? null,
    };
  }
}
