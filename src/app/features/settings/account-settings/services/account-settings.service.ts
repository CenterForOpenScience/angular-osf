import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { UserMapper } from '@osf/shared/mappers';
import { UserDataJsonApi, UserModel } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { AccountSettingsMapper, MapExternalIdentities } from '../mappers';
import {
  AccountSettings,
  AccountSettingsDataJsonApi,
  AccountSettingsResponseJsonApi,
  ExternalIdentity,
  ListIdentitiesResponseJsonApi,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class AccountSettingsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  getSettings(): Observable<AccountSettings> {
    return this.jsonApiService
      .get<AccountSettingsResponseJsonApi>(`${this.apiUrl}/users/me/settings/`)
      .pipe(map((response) => AccountSettingsMapper.getAccountSettings(response.data)));
  }

  updateSettings(userId: string, settings: Record<string, string>): Observable<AccountSettings> {
    const body = {
      data: {
        id: userId,
        attributes: settings,
        type: 'user_settings',
      },
    };

    return this.jsonApiService
      .patch<AccountSettingsDataJsonApi>(`${this.apiUrl}/users/${userId}/settings/`, body)
      .pipe(map((response) => AccountSettingsMapper.getAccountSettings(response)));
  }

  updateLocation(userId: string, locationId: string): Observable<UserModel> {
    const body = {
      data: {
        id: userId,
        attributes: {},
        relationships: {
          default_region: {
            data: {
              type: 'regions',
              id: locationId,
            },
          },
        },
        type: 'users',
      },
    };

    return this.jsonApiService
      .patch<UserDataJsonApi>(`${this.apiUrl}/users/${userId}/`, body)
      .pipe(map((user) => UserMapper.fromUserGetResponse(user)));
  }

  updateIndexing(userId: string, allowIndexing: boolean): Observable<UserModel> {
    const body = {
      data: {
        id: userId,
        attributes: {
          allow_indexing: allowIndexing,
        },
        relationships: {},
        type: 'users',
      },
    };

    return this.jsonApiService
      .patch<UserDataJsonApi>(`${this.apiUrl}/users/${userId}/`, body)
      .pipe(map((user) => UserMapper.fromUserGetResponse(user)));
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<void> {
    const body = {
      data: {
        type: 'user_passwords',
        attributes: {
          existing_password: oldPassword,
          new_password: newPassword,
        },
      },
    };

    return this.jsonApiService.post(`${this.apiUrl}/users/me/settings/password/`, body);
  }

  getExternalIdentities(): Observable<ExternalIdentity[]> {
    const params: Record<string, string> = {
      page: '1',
      'page[size]': '10',
    };

    return this.jsonApiService
      .get<ListIdentitiesResponseJsonApi>(`${this.apiUrl}/users/me/settings/identities/`, params)
      .pipe(map((response) => MapExternalIdentities(response.data)));
  }

  deleteExternalIdentity(id: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/users/me/settings/identities/${id}/`);
  }
}
