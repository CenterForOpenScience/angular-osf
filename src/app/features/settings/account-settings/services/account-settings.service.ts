import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { UserMapper } from '@osf/shared/mappers';
import { IdName, JsonApiResponse, User, UserGetResponse } from '@osf/shared/models';
import { JsonApiService } from '@osf/shared/services';

import { MapAccountSettings, MapExternalIdentities, MapRegions } from '../mappers';
import {
  AccountSettings,
  ExternalIdentity,
  GetAccountSettingsResponseJsonApi,
  GetRegionsResponseJsonApi,
  ListIdentitiesResponseJsonApi,
} from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountSettingsService {
  private readonly jsonApiService = inject(JsonApiService);

  getRegions(): Observable<IdName[]> {
    return this.jsonApiService
      .get<GetRegionsResponseJsonApi>(`${environment.apiUrl}/regions/`)
      .pipe(map((response) => MapRegions(response.data)));
  }

  updateLocation(userId: string, locationId: string): Observable<User> {
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
      .patch<UserGetResponse>(`${environment.apiUrl}/users/${userId}/`, body)
      .pipe(map((user) => UserMapper.fromUserGetResponse(user)));
  }

  updateIndexing(userId: string, allowIndexing: boolean): Observable<User> {
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
      .patch<UserGetResponse>(`${environment.apiUrl}/users/${userId}/`, body)
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

    return this.jsonApiService.post(`${environment.apiUrl}/users/me/settings/password/`, body);
  }

  getExternalIdentities(): Observable<ExternalIdentity[]> {
    const params: Record<string, string> = {
      page: '1',
      'page[size]': '10',
    };

    return this.jsonApiService
      .get<ListIdentitiesResponseJsonApi>(`${environment.apiUrl}/users/me/settings/identities/`, params)
      .pipe(map((response) => MapExternalIdentities(response.data)));
  }

  deleteExternalIdentity(id: string): Observable<void> {
    return this.jsonApiService.delete(`${environment.apiUrl}/users/me/settings/identities/${id}/`);
  }

  getSettings(): Observable<AccountSettings> {
    return this.jsonApiService
      .get<JsonApiResponse<GetAccountSettingsResponseJsonApi, null>>(`${environment.apiUrl}/users/me/settings/`)
      .pipe(map((response) => MapAccountSettings(response.data)));
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
      .patch<GetAccountSettingsResponseJsonApi>(`${environment.apiUrl}/users/${userId}/settings`, body)
      .pipe(map((response) => MapAccountSettings(response)));
  }
}
