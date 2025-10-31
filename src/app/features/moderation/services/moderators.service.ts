import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { JsonApiResponse, ResponseJsonApi } from '@osf/shared/models/common/json-api.model';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';
import { UserDataJsonApi } from '@osf/shared/models/user/user-json-api.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';
import { StringOrNull } from '@shared/helpers/types.helper';

import { AddModeratorType } from '../enums';
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

  searchUsers(value: string, page = 1): Observable<PaginatedData<ModeratorAddModel[]>> {
    const baseUrl = `${this.apiUrl}/users/?filter[full_name]=${value}&page=${page}`;

    return this.jsonApiService
      .get<ResponseJsonApi<UserDataJsonApi[]>>(baseUrl)
      .pipe(map((response) => ModerationMapper.fromUsersWithPaginationGetResponse(response)));
  }
}
