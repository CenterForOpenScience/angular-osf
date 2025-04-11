import { inject, Injectable } from '@angular/core';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { map, Observable } from 'rxjs';
import {
  Addon,
  AddonResponse,
  AuthorizedAddon,
  AuthorizedAddonResponse,
  UserReference,
} from '@osf/features/settings/addons/entities/addons.entities';
import { AddonMapper } from '@osf/features/settings/addons/addon.mapper';
import { Store } from '@ngxs/store';
import { UserState } from '@core/store/user';

@Injectable({
  providedIn: 'root',
})
export class AddonsService {
  #store = inject(Store);
  jsonApiService = inject(JsonApiService);
  baseUrl = 'https://addons.staging4.osf.io/v1/';
  currentUser = this.#store.selectSignal(UserState.getCurrentUser);

  getAddons(addonType: string): Observable<Addon[]> {
    return this.jsonApiService
      .getDataArray<AddonResponse>(
        this.baseUrl + `external-${addonType}-services`,
      )
      .pipe(
        map((response) => {
          return response.map((item) => AddonMapper.fromResponse(item));
        }),
      );
  }

  getUserReference(): Observable<UserReference[]> {
    const userUri = `https://staging4.osf.io/${this.currentUser()!.id}`;
    const params = { 'filter[user_uri]': userUri };

    return this.jsonApiService.getDataArray<UserReference>(
      this.baseUrl + 'user-references',
      params,
    );
  }

  getAuthorizedAddons(addonType: string): Observable<AuthorizedAddon[]> {
    return this.jsonApiService
      .getFullArrayResponse<AuthorizedAddonResponse>(
        this.baseUrl +
          `user-references/3873149c-9fb7-4444-bbb9-138d9f358a85/authorized_${addonType}_accounts?include=external-${addonType}-service`,
      )
      .pipe(
        map((response) => {
          return response.data.map((item) =>
            AddonMapper.fromAuthorizedAddonResponse(item, response.included),
          );
        }),
      );
  }
}
