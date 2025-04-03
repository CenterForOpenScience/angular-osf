import { inject, Injectable } from '@angular/core';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { map, Observable } from 'rxjs';
import {
  Addon,
  AddonResponse,
  UserReference,
} from '@shared/entities/addons.entities';
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

  // baseUrl = 'https://api.staging4.osf.io/v2/';

  getUserReference(): Observable<UserReference[]> {
    const userUri = `https://staging4.osf.io/${this.currentUser()!.id}`;
    const params = { 'filter[user_uri]': userUri };

    return this.jsonApiService.getArray<UserReference>(
      this.baseUrl + 'user-references',
      params,
    );
  }

  getAddons(addonType: string): Observable<Addon[]> {
    return this.jsonApiService
      .getArray<AddonResponse>(this.baseUrl + `external-${addonType}-services`)
      .pipe(
        map((response) => {
          console.log(response);
          return response.map((item) => AddonMapper.fromResponse(item));
        }),
      );
  }

  // getCitationAddons(): Observable<Addon[]> {
  //   return this.jsonApiService
  //     .getArray<AddonResponse>(this.baseUrl + 'external-citation-services')
  //     .pipe(
  //       map((response) => {
  //         console.log(response);
  //         return response.map((item) => AddonMapper.fromResponse(item));
  //       }),
  //     );
  // }
}
