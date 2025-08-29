import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ProfileSettingsKey } from '@osf/shared/enums';
import { UserMapper } from '@osf/shared/mappers';
import {
  JsonApiResponse,
  ProfileSettingsUpdate,
  User,
  UserData,
  UserDataJsonApi,
  UserDataResponseJsonApi,
  UserResponseJsonApi,
  UserSettings,
  UserSettingsGetResponse,
} from '@osf/shared/models';
import { JsonApiService } from '@shared/services';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  jsonApiService = inject(JsonApiService);

  getUserById(userId: string): Observable<User> {
    return this.jsonApiService
      .get<UserResponseJsonApi>(`${environment.apiUrl}/users/${userId}/`)
      .pipe(map((response) => UserMapper.fromUserGetResponse(response.data)));
  }

  getCurrentUser(): Observable<UserData> {
    return this.jsonApiService
      .get<UserDataResponseJsonApi>(`${environment.apiUrl}/`)
      .pipe(map((response) => UserMapper.fromUserDataGetResponse(response)));
  }

  getCurrentUserSettings(): Observable<UserSettings> {
    return this.jsonApiService
      .get<JsonApiResponse<UserSettingsGetResponse, null>>(`${environment.apiUrl}/users/me/settings/`)
      .pipe(map((response) => UserMapper.fromUserSettingsGetResponse(response.data)));
  }

  updateUserSettings(userId: string, userSettings: UserSettings): Observable<UserSettings> {
    const request = UserMapper.toUpdateUserSettingsRequest(userId, userSettings);

    return this.jsonApiService
      .patch<UserSettingsGetResponse>(`${environment.apiUrl}/users/${userId}/settings/`, request)
      .pipe(map((response) => UserMapper.fromUserSettingsGetResponse(response)));
  }

  updateUserProfile(userId: string, key: string, data: ProfileSettingsUpdate): Observable<User> {
    const patchedData = key === ProfileSettingsKey.User ? data : { [key]: data };

    return this.jsonApiService
      .patch<UserDataJsonApi>(`${environment.apiUrl}/users/${userId}/`, {
        data: { type: 'users', id: userId, attributes: patchedData },
      })
      .pipe(map((response) => UserMapper.fromUserGetResponse(response)));
  }
}
