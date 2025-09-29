import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ProfileSettingsKey } from '@osf/shared/enums';
import { UserMapper } from '@osf/shared/mappers';
import {
  ProfileSettingsUpdate,
  UserAcceptedTermsOfServiceJsonApi,
  UserData,
  UserDataJsonApi,
  UserDataResponseJsonApi,
  UserModel,
  UserResponseJsonApi,
} from '@osf/shared/models';
import { JsonApiService } from '@shared/services';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getUserById(userId: string): Observable<UserModel> {
    return this.jsonApiService
      .get<UserResponseJsonApi>(`${this.apiUrl}/users/${userId}/`)
      .pipe(map((response) => UserMapper.fromUserGetResponse(response.data)));
  }

  getCurrentUser(): Observable<UserData> {
    return this.jsonApiService
      .get<UserDataResponseJsonApi>(`${this.apiUrl}/`)
      .pipe(map((response) => UserMapper.fromUserDataGetResponse(response)));
  }

  updateUserProfile(userId: string, key: string, data: ProfileSettingsUpdate): Observable<UserModel> {
    const dataFormatted =
      // eslint-disable-next-line no-prototype-builtins
      ProfileSettingsKey.User && data.hasOwnProperty('acceptedTermsOfService')
        ? { accepted_terms_of_service: true }
        : data;

    const patchedData = key === ProfileSettingsKey.User ? dataFormatted : { [key]: dataFormatted };

    return this.jsonApiService
      .patch<UserDataJsonApi>(`${this.apiUrl}/users/${userId}/`, {
        data: { type: 'users', id: userId, attributes: patchedData },
      })
      .pipe(map((response) => UserMapper.fromUserGetResponse(response)));
  }

  updateUserAcceptedTermsOfService(userId: string, data: UserAcceptedTermsOfServiceJsonApi): Observable<UserModel> {
    return this.jsonApiService
      .patch<UserDataJsonApi>(`${this.apiUrl}/users/${userId}/`, {
        data: { type: 'users', id: userId, attributes: data },
      })
      .pipe(map((response) => UserMapper.fromUserGetResponse(response)));
  }
}
