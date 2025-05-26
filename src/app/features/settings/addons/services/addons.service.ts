import { Store } from '@ngxs/store';

import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';
import { UserSelectors } from '@osf/core/store/user';

import { AddonMapper } from '../mappers';
import {
  Addon,
  AddonGetResponse,
  AddonRequest,
  AddonResponse,
  AuthorizedAddon,
  AuthorizedAddonGetResponse,
  IncludedAddonData,
  UserReference,
} from '../models';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddonsService {
  #store = inject(Store);
  #jsonApiService = inject(JsonApiService);
  #currentUser = this.#store.selectSignal(UserSelectors.getCurrentUser);

  getAddons(addonType: string): Observable<Addon[]> {
    return this.#jsonApiService
      .get<JsonApiResponse<AddonGetResponse[], null>>(`${environment.addonsApiUrl}/external-${addonType}-services`)
      .pipe(
        map((response) => {
          return response.data.map((item) => AddonMapper.fromResponse(item));
        })
      );
  }

  getAddonsUserReference(): Observable<UserReference[]> {
    const currentUser = this.#currentUser();
    if (!currentUser) throw new Error('Current user not found');

    const userUri = `https://staging4.osf.io/${currentUser.id}`;
    const params = {
      'filter[user_uri]': userUri,
    };

    return this.#jsonApiService
      .get<JsonApiResponse<UserReference[], null>>(environment.addonsApiUrl + '/user-references/', params)
      .pipe(map((response) => response.data));
  }

  getAuthorizedAddons(addonType: string, referenceId: string): Observable<AuthorizedAddon[]> {
    const params = {
      [`fields[external-${addonType}-services]`]: 'external_service_name',
    };
    return this.#jsonApiService
      .get<
        JsonApiResponse<AuthorizedAddonGetResponse[], IncludedAddonData[]>
      >(`${environment.addonsApiUrl}/user-references/${referenceId}/authorized_${addonType}_accounts/?include=external-${addonType}-service`, params)
      .pipe(
        map((response) => {
          return response.data.map((item) => AddonMapper.fromAuthorizedAddonResponse(item, response.included));
        })
      );
  }

  createAuthorizedAddon(addonRequestPayload: AddonRequest, addonType: string): Observable<AddonResponse> {
    return this.#jsonApiService.post<AddonResponse>(
      `${environment.addonsApiUrl}/authorized-${addonType}-accounts/`,
      addonRequestPayload
    );
  }

  updateAuthorizedAddon(
    addonRequestPayload: AddonRequest,
    addonType: string,
    addonId: string
  ): Observable<AddonResponse> {
    return this.#jsonApiService.patch<AddonResponse>(
      `${environment.addonsApiUrl}/authorized-${addonType}-accounts/${addonId}/`,
      addonRequestPayload
    );
  }

  deleteAuthorizedAddon(id: string, addonType: string): Observable<void> {
    return this.#jsonApiService.delete(`${environment.addonsApiUrl}/authorized-${addonType}-accounts/${id}/`);
  }
}
