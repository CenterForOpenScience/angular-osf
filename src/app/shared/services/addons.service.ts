import { Store } from '@ngxs/store';

import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@core/models';
import { JsonApiService } from '@core/services';
import { UserSelectors } from '@core/store/user';
import { AddonMapper } from '@osf/shared/mappers';
import {
  Addon,
  AddonGetResponseJsonApi,
  AuthorizedAddon,
  AuthorizedAddonGetResponseJsonApi,
  AuthorizedAddonRequestJsonApi,
  AuthorizedAddonResponseJsonApi,
  ConfiguredAddon,
  ConfiguredAddonGetResponseJsonApi,
  ConfiguredAddonRequestJsonApi,
  ConfiguredAddonResponseJsonApi,
  IncludedAddonData,
  OperationInvocation,
  OperationInvocationRequestJsonApi,
  ResourceReferenceJsonApi,
  UserReferenceJsonApi,
} from '@shared/models';
import { OperationInvocationResponseJsonApi } from '@shared/models/addons/operation-invocation.models';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddonsService {
  #store = inject(Store);
  #jsonApiService = inject(JsonApiService);
  #currentUser = this.#store.selectSignal(UserSelectors.getCurrentUser);

  getAddons(addonType: string): Observable<Addon[]> {
    return this.#jsonApiService
      .get<
        JsonApiResponse<AddonGetResponseJsonApi[], null>
      >(`${environment.addonsApiUrl}/external-${addonType}-services`)
      .pipe(
        map((response) => {
          return response.data.map((item) => AddonMapper.fromResponse(item));
        })
      );
  }

  getAddonsUserReference(): Observable<UserReferenceJsonApi[]> {
    const currentUser = this.#currentUser();
    if (!currentUser) throw new Error('Current user not found');

    const userUri = `https://staging4.osf.io/${currentUser.id}`;
    const params = {
      'filter[user_uri]': userUri,
    };

    return this.#jsonApiService
      .get<JsonApiResponse<UserReferenceJsonApi[], null>>(environment.addonsApiUrl + '/user-references/', params)
      .pipe(map((response) => response.data));
  }

  getAddonsResourceReference(resourceId: string): Observable<ResourceReferenceJsonApi[]> {
    const resourceUri = `https://staging4.osf.io/${resourceId}`;
    const params = {
      'filter[resource_uri]': resourceUri,
    };

    return this.#jsonApiService
      .get<
        JsonApiResponse<ResourceReferenceJsonApi[], null>
      >(environment.addonsApiUrl + '/resource-references/', params)
      .pipe(map((response) => response.data));
  }

  getAuthorizedAddons(addonType: string, referenceId: string): Observable<AuthorizedAddon[]> {
    const params = {
      [`fields[external-${addonType}-services]`]: 'external_service_name',
    };
    return this.#jsonApiService
      .get<
        JsonApiResponse<AuthorizedAddonGetResponseJsonApi[], IncludedAddonData[]>
      >(`${environment.addonsApiUrl}/user-references/${referenceId}/authorized_${addonType}_accounts/?include=external-${addonType}-service`, params)
      .pipe(
        map((response) => {
          return response.data.map((item) => AddonMapper.fromAuthorizedAddonResponse(item, response.included));
        })
      );
  }

  getConfiguredAddons(addonType: string, referenceId: string): Observable<ConfiguredAddon[]> {
    return this.#jsonApiService
      .get<
        JsonApiResponse<ConfiguredAddonGetResponseJsonApi[], null>
      >(`${environment.addonsApiUrl}/resource-references/${referenceId}/configured_${addonType}_addons/`)
      .pipe(
        map((response) => {
          return response.data.map((item) => AddonMapper.fromConfiguredAddonResponse(item));
        })
      );
  }

  createAuthorizedAddon(
    addonRequestPayload: AuthorizedAddonRequestJsonApi,
    addonType: string
  ): Observable<AuthorizedAddonResponseJsonApi> {
    return this.#jsonApiService.post<AuthorizedAddonResponseJsonApi>(
      `${environment.addonsApiUrl}/authorized-${addonType}-accounts/`,
      addonRequestPayload
    );
  }

  updateAuthorizedAddon(
    addonRequestPayload: AuthorizedAddonRequestJsonApi,
    addonType: string,
    addonId: string
  ): Observable<AuthorizedAddonResponseJsonApi> {
    return this.#jsonApiService.patch<AuthorizedAddonResponseJsonApi>(
      `${environment.addonsApiUrl}/authorized-${addonType}-accounts/${addonId}/`,
      addonRequestPayload
    );
  }

  createConfiguredAddon(
    addonRequestPayload: ConfiguredAddonRequestJsonApi,
    addonType: string
  ): Observable<ConfiguredAddonResponseJsonApi> {
    return this.#jsonApiService.post<ConfiguredAddonResponseJsonApi>(
      `${environment.addonsApiUrl}/configured-${addonType}-addons/`,
      addonRequestPayload
    );
  }

  updateConfiguredAddon(
    addonRequestPayload: ConfiguredAddonRequestJsonApi,
    addonType: string,
    addonId: string
  ): Observable<ConfiguredAddonResponseJsonApi> {
    return this.#jsonApiService.patch<ConfiguredAddonResponseJsonApi>(
      `${environment.addonsApiUrl}/configured-${addonType}-addons/${addonId}/`,
      addonRequestPayload
    );
  }

  createAddonOperationInvocation(
    invocationRequestPayload: OperationInvocationRequestJsonApi
  ): Observable<OperationInvocation> {
    return this.#jsonApiService
      .post<OperationInvocationResponseJsonApi>(
        `${environment.addonsApiUrl}/addon-operation-invocations/`,
        invocationRequestPayload
      )
      .pipe(
        map((response) => {
          return AddonMapper.fromOperationInvocationResponse(response);
        })
      );
  }

  deleteAuthorizedAddon(id: string, addonType: string): Observable<void> {
    return this.#jsonApiService.delete(`${environment.addonsApiUrl}/authorized-${addonType}-accounts/${id}/`);
  }

  deleteConfiguredAddon(id: string, addonType: string): Observable<void> {
    return this.#jsonApiService.delete(`${environment.addonsApiUrl}/${addonType}/${id}/`);
  }
}
