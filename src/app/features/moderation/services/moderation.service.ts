import { map, Observable, of } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponseWithPaging, UserGetResponse } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';
import { PaginatedData } from '@osf/shared/models';

import { ModerationMapper } from '../mappers';
import { ModeratorAddModel, ModeratorModel, ModeratorResponseJsonApi } from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ModerationService {
  private readonly tesModeratorsUrl = 'assets/collection-moderators.json';
  private readonly jsonApiService = inject(JsonApiService);

  getCollectionModerators(providerId: string): Observable<ModeratorModel[]> {
    return (
      this.jsonApiService
        // .get<ModeratorResponseJsonApi>(`${this.baseUrl}/providers/collections/${providerId}/moderators/`)
        .get<ModeratorResponseJsonApi>(this.tesModeratorsUrl)
        .pipe(map((response) => response.data.map((moderator) => ModerationMapper.fromModeratorResponse(moderator))))
    );
  }

  addCollectionModerator(providerId: string, data: ModeratorAddModel): Observable<ModeratorModel> {
    return of({} as ModeratorModel);
  }

  updateCollectionModerator(providerId: string, data: ModeratorAddModel): Observable<ModeratorModel> {
    return of({} as ModeratorModel);
  }

  deleteCollectionModerator(providerId: string, userId: string): Observable<void> {
    const baseUrl = ``;

    return this.jsonApiService.delete(baseUrl);
  }

  searchUsers(value: string, page = 1): Observable<PaginatedData<ModeratorAddModel[]>> {
    const baseUrl = `${environment.apiUrl}/users/?filter[full_name]=${value}&page=${page}`;

    return this.jsonApiService
      .get<JsonApiResponseWithPaging<UserGetResponse[], null>>(baseUrl)
      .pipe(map((response) => ModerationMapper.fromUsersWithPaginationGetResponse(response)));
  }
}
