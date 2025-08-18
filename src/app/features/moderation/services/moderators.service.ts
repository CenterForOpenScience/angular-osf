import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ResourceType } from '@osf/shared/enums';
import { JsonApiResponse, PaginatedData, ResponseJsonApi, UserGetResponse } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { AddModeratorType } from '../enums';
import { ModerationMapper } from '../mappers';
import { ModeratorAddModel, ModeratorDataJsonApi, ModeratorModel, ModeratorResponseJsonApi } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ModeratorsService {
  private readonly jsonApiService = inject(JsonApiService);

  private readonly urlMap = new Map<ResourceType, string>([
    [ResourceType.Collection, 'providers/collections'],
    [ResourceType.Registration, 'providers/registrations'],
    [ResourceType.Preprint, 'preprint_providers'],
  ]);

  getModerators(resourceId: string, resourceType: ResourceType): Observable<ModeratorModel[]> {
    const baseUrl = `${environment.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/moderators`;

    return this.jsonApiService
      .get<ModeratorResponseJsonApi>(baseUrl)
      .pipe(map((response) => response.data.map((moderator) => ModerationMapper.fromModeratorResponse(moderator))));
  }

  addModerator(resourceId: string, resourceType: ResourceType, data: ModeratorAddModel): Observable<ModeratorModel> {
    const baseUrl = `${environment.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/moderators/`;
    const type = data.id ? AddModeratorType.Search : AddModeratorType.Invite;

    const moderatorData = { data: ModerationMapper.toModeratorAddRequest(data, type) };

    return this.jsonApiService
      .post<JsonApiResponse<ModeratorDataJsonApi, null>>(baseUrl, moderatorData)
      .pipe(map((moderator) => ModerationMapper.fromModeratorResponse(moderator.data)));
  }

  updateModerator(resourceId: string, resourceType: ResourceType, data: ModeratorAddModel): Observable<ModeratorModel> {
    const baseUrl = `${environment.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/moderators/${data.id}`;
    const moderatorData = { data: ModerationMapper.toModeratorAddRequest(data) };

    return this.jsonApiService
      .patch<ModeratorDataJsonApi>(baseUrl, moderatorData)
      .pipe(map((moderator) => ModerationMapper.fromModeratorResponse(moderator)));
  }

  deleteModerator(resourceId: string, resourceType: ResourceType, userId: string): Observable<void> {
    const baseUrl = `${environment.apiUrl}/${this.urlMap.get(resourceType)}/${resourceId}/moderators/${userId}`;

    return this.jsonApiService.delete(baseUrl);
  }

  searchUsers(value: string, page = 1): Observable<PaginatedData<ModeratorAddModel[]>> {
    const baseUrl = `${environment.apiUrl}/users/?filter[full_name]=${value}&page=${page}`;

    return this.jsonApiService
      .get<ResponseJsonApi<UserGetResponse[]>>(baseUrl)
      .pipe(map((response) => ModerationMapper.fromUsersWithPaginationGetResponse(response)));
  }
}
