import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import {
  User,
  UserGetResponse,
  UserSettings,
  UserSettingsGetResponse,
} from '@core/services/user/user.models';
import { JsonApiResponse } from '@core/services/json-api/json-api.entity';
import { UserMapper } from '@core/services/user/users.mapper';

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
      .get<
        JsonApiResponse<UserSettingsGetResponse, null>
      >(this.baseUrl + 'users/me/settings/')
      .pipe(
        map((response) =>
          UserMapper.fromUserSettingsGetResponse(response.data),
        ),
      );
  }
}
