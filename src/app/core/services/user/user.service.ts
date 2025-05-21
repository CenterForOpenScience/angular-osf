import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@core/services/json-api/json-api.entity';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { UserMapper } from '@core/services/user/user.mapper';
import { User, UserGetResponse, UserSettings, UserSettingsGetResponse } from '@core/services/user/user.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = 'https://api.staging4.osf.io/v2/';
  jsonApiService = inject(JsonApiService);

  getCurrentUser(): Observable<User> {
    return this.jsonApiService
      .get<JsonApiResponse<UserGetResponse, null>>(this.baseUrl + 'users/me/')
      .pipe(map((user) => UserMapper.fromUserGetResponse(user.data)));
  }

  getCurrentUserSettings(): Observable<UserSettings> {
    return this.jsonApiService
      .get<JsonApiResponse<UserSettingsGetResponse, null>>(this.baseUrl + 'users/me/settings/')
      .pipe(map((response) => UserMapper.fromUserSettingsGetResponse(response.data)));
  }

  updateUserSettings(userId: string, userSettings: UserSettings): Observable<UserSettings> {
    const request = UserMapper.toUpdateUserSettingsRequest(userId, userSettings);

    return this.jsonApiService
      .patch<UserSettingsGetResponse>(this.baseUrl + `users/${userId}/settings/`, request)
      .pipe(map((response) => UserMapper.fromUserSettingsGetResponse(response)));
  }
}
