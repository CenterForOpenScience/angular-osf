import { Store } from '@ngxs/store';

import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services/json-api/json-api.service';
import { User, UserGetResponse, UserMapper } from '@core/services/user';
import { UserSelectors } from '@core/store/user';
import { ApiData, JsonApiResponse } from '@osf/core/services/json-api/json-api.entity';

import { environment } from '../../../../../environments/environment';
import { MapAccountSettings, MapEmail, MapEmails, MapExternalIdentities, MapRegions } from '../mappers';
import {
  AccountEmail,
  AccountEmailResponse,
  AccountSettings,
  ExternalIdentity,
  GetAccountSettingsResponse,
  GetEmailResponse,
  GetRegionsResponse,
  ListEmailsResponse,
  ListIdentitiesResponse,
  Region,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class AccountSettingsService {
  #store = inject(Store);
  #jsonApiService = inject(JsonApiService);
  #currentUser = this.#store.selectSignal(UserSelectors.getCurrentUser);

  getEmails(): Observable<AccountEmail[]> {
    const params: Record<string, string> = {
      page: '1',
      'page[size]': '10',
    };

    return this.#jsonApiService
      .get<ListEmailsResponse>(`${environment.apiUrl}/users/${this.#currentUser()?.id}/settings/emails`, params)
      .pipe(map((response) => MapEmails(response.data)));
  }

  getEmail(
    emailId: string,
    userId: string,
    params: Record<string, string> | undefined = undefined
  ): Observable<AccountEmail> {
    return this.#jsonApiService
      .get<GetEmailResponse>(`${environment.apiUrl}/users/${userId}/settings/emails/${emailId}`, params)
      .pipe(map((response) => MapEmail(response.data)));
  }

  resendConfirmation(emailId: string, userId: string): Observable<AccountEmail> {
    const params: Record<string, string> = {
      resend_confirmation: 'true',
    };

    return this.getEmail(emailId, userId, params);
  }

  addEmail(email: string): Observable<AccountEmail> {
    const body = {
      data: {
        attributes: {
          email_address: email,
        },
        relationships: {
          user: {
            data: {
              id: this.#currentUser()?.id,
              type: 'users',
            },
          },
        },
        type: 'user_emails',
      },
    };

    return this.#jsonApiService
      .post<
        ApiData<AccountEmailResponse, null, null>
      >(`${environment.apiUrl}/users/${this.#currentUser()?.id}/settings/emails/`, body)
      .pipe(map((response) => MapEmail(response)));
  }

  deleteEmail(emailId: string): Observable<void> {
    return this.#jsonApiService.delete(
      `${environment.apiUrl}/users/${this.#currentUser()?.id}/settings/emails/${emailId}`
    );
  }

  verifyEmail(userId: string, emailId: string): Observable<AccountEmail> {
    const body = {
      data: {
        id: emailId,
        attributes: {
          verified: true,
        },
        type: 'user_emails',
      },
    };

    return this.#jsonApiService
      .patch<
        ApiData<AccountEmailResponse, null, null>
      >(`${environment.apiUrl}/users/${userId}/settings/emails/${emailId}/`, body)
      .pipe(map((response) => MapEmail(response)));
  }

  makePrimary(emailId: string): Observable<AccountEmail> {
    const body = {
      data: {
        id: emailId,
        attributes: {
          primary: true,
        },
        type: 'user_emails',
      },
    };

    return this.#jsonApiService
      .patch<
        ApiData<AccountEmailResponse, null, null>
      >(`${environment.apiUrl}/users/${this.#currentUser()?.id}/settings/emails/${emailId}/`, body)
      .pipe(map((response) => MapEmail(response)));
  }

  getRegions(): Observable<Region[]> {
    return this.#jsonApiService
      .get<GetRegionsResponse>(`${environment.apiUrl}/regions/`)
      .pipe(map((response) => MapRegions(response.data)));
  }

  updateLocation(locationId: string): Observable<User> {
    const body = {
      data: {
        id: this.#currentUser()?.id,
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

    return this.#jsonApiService
      .patch<UserGetResponse>(`${environment.apiUrl}/users/${this.#currentUser()?.id}`, body)
      .pipe(map((user) => UserMapper.fromUserGetResponse(user)));
  }

  updateIndexing(allowIndexing: boolean): Observable<User> {
    const body = {
      data: {
        id: this.#currentUser()?.id,
        attributes: {
          allow_indexing: allowIndexing,
        },
        relationships: {},
        type: 'users',
      },
    };

    return this.#jsonApiService
      .patch<UserGetResponse>(`${environment.apiUrl}/users/${this.#currentUser()?.id}`, body)
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

    return this.#jsonApiService.post(`${environment.apiUrl}/users/${this.#currentUser()?.id}/settings/password`, body);
  }

  getExternalIdentities(): Observable<ExternalIdentity[]> {
    const params: Record<string, string> = {
      page: '1',
      'page[size]': '10',
    };

    return this.#jsonApiService
      .get<ListIdentitiesResponse>(`${environment.apiUrl}/users/me/settings/identities/`, params)
      .pipe(map((response) => MapExternalIdentities(response.data)));
  }

  deleteExternalIdentity(id: string): Observable<void> {
    return this.#jsonApiService.delete(`${environment.apiUrl}/users/me/settings/identities/${id}`);
  }

  getSettings(): Observable<AccountSettings> {
    return this.#jsonApiService
      .get<
        JsonApiResponse<GetAccountSettingsResponse, null>
      >(`${environment.apiUrl}/users/${this.#currentUser()?.id}/settings`)
      .pipe(map((response) => MapAccountSettings(response.data)));
  }

  updateSettings(settings: Record<string, string>): Observable<AccountSettings> {
    const body = {
      data: {
        id: this.#currentUser()?.id,
        attributes: settings,
        relationships: {},
        type: 'user_settings',
      },
    };

    return this.#jsonApiService
      .patch<GetAccountSettingsResponse>(`${environment.apiUrl}/users/${this.#currentUser()?.id}/settings`, body)
      .pipe(map((response) => MapAccountSettings(response)));
  }
}
