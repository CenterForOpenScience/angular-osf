import { select } from '@ngxs/store';

import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { UserSelectors } from '@core/store/user';
import { AddonMapper } from '@osf/shared/mappers';
import {
  AddonGetResponseJsonApi,
  AddonModel,
  AuthorizedAccountModel,
  AuthorizedAddonGetResponseJsonApi,
  AuthorizedAddonRequestJsonApi,
  AuthorizedAddonResponseJsonApi,
  ConfiguredAddonGetResponseJsonApi,
  ConfiguredAddonModel,
  ConfiguredAddonRequestJsonApi,
  ConfiguredAddonResponseJsonApi,
  IncludedAddonData,
  JsonApiResponse,
  OperationInvocation,
  OperationInvocationRequestJsonApi,
  OperationInvocationResponseJsonApi,
  ResourceReferenceJsonApi,
  UserReferenceJsonApi,
} from '@osf/shared/models';

import { JsonApiService } from '../json-api.service';

@Injectable({
  providedIn: 'root',
})
export class AddonsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);
  private readonly apiUrl = this.environment.addonsApiUrl;
  private readonly webUrl = this.environment.webUrl;
  private readonly currentUser = select(UserSelectors.getCurrentUser);

  getAddons(addonType: string): Observable<AddonModel[]> {
    return this.jsonApiService
      .get<JsonApiResponse<AddonGetResponseJsonApi[], null>>(`${this.apiUrl}/external-${addonType}-services`)
      .pipe(map((response) => response.data.map((item) => AddonMapper.fromResponse(item))));
  }

  getAddonsUserReference(): Observable<UserReferenceJsonApi[]> {
    const currentUser = this.currentUser();
    if (!currentUser) throw new Error('Current user not found');

    const userUri = `${this.webUrl}/${currentUser.id}`;
    const params = { 'filter[user_uri]': userUri };

    return this.jsonApiService
      .get<JsonApiResponse<UserReferenceJsonApi[], null>>(this.apiUrl + '/user-references/', params)
      .pipe(map((response) => response.data));
  }

  getAddonsResourceReference(resourceId: string): Observable<ResourceReferenceJsonApi[]> {
    const resourceUri = `${this.webUrl}/${resourceId}`;
    const params = { 'filter[resource_uri]': resourceUri };

    return this.jsonApiService
      .get<JsonApiResponse<ResourceReferenceJsonApi[], null>>(this.apiUrl + '/resource-references/', params)
      .pipe(map((response) => response.data));
  }

  getAuthorizedAddons(addonType: string, referenceId: string): Observable<AuthorizedAccountModel[]> {
    const params = {
      [`fields[external-${addonType}-services]`]: 'external_service_name,credentials_format',
    };
    return this.jsonApiService
      .get<
        JsonApiResponse<AuthorizedAddonGetResponseJsonApi[], IncludedAddonData[]>
      >(`${this.apiUrl}/user-references/${referenceId}/authorized_${addonType}_accounts/?include=external-${addonType}-service`, params)
      .pipe(
        map((response) => response.data.map((item) => AddonMapper.fromAuthorizedAddonResponse(item, response.included)))
      );
  }

  getAuthorizedStorageOauthToken(accountId: string, addonType: string): Observable<AuthorizedAccountModel> {
    return this.jsonApiService
      .patch<AuthorizedAddonGetResponseJsonApi>(`${this.apiUrl}/authorized-${addonType}-accounts/${accountId}`, {
        data: {
          id: accountId,
          type: `authorized-${addonType}-accounts`,
          attributes: { serialize_oauth_token: 'true' },
        },
      })
      .pipe(
        map((response) => {
          return AddonMapper.fromAuthorizedAddonResponse(response as AuthorizedAddonGetResponseJsonApi);
        })
      );
  }

  getConfiguredAddons(addonType: string, referenceId: string): Observable<ConfiguredAddonModel[]> {
    return this.jsonApiService
      .get<
        JsonApiResponse<ConfiguredAddonGetResponseJsonApi[], null>
      >(`${this.apiUrl}/resource-references/${referenceId}/configured_${addonType}_addons/`)
      .pipe(
        map((response) => {
          return response.data.map((item) => AddonMapper.fromConfiguredAddonResponse(item));
        })
      );
  }

  createAuthorizedAddon(
    addonRequestPayload: AuthorizedAddonRequestJsonApi,
    addonType: string
  ): Observable<AuthorizedAccountModel> {
    return this.jsonApiService
      .post<
        JsonApiResponse<AuthorizedAddonResponseJsonApi, IncludedAddonData[]>
      >(`${this.apiUrl}/authorized-${addonType}-accounts/?include=external-${addonType}-service`, addonRequestPayload)
      .pipe(map((response) => AddonMapper.fromAuthorizedAddonResponse(response.data, response.included)));
  }

  updateAuthorizedAddon(
    addonRequestPayload: AuthorizedAddonRequestJsonApi,
    addonType: string,
    addonId: string
  ): Observable<AuthorizedAccountModel> {
    return this.jsonApiService.http
      .patch<
        JsonApiResponse<AuthorizedAddonResponseJsonApi, IncludedAddonData[]>
      >(`${this.apiUrl}/authorized-${addonType}-accounts/${addonId}/?include=external-${addonType}-service`, addonRequestPayload)
      .pipe(map((response) => AddonMapper.fromAuthorizedAddonResponse(response.data, response.included)));
  }

  createConfiguredAddon(
    addonRequestPayload: ConfiguredAddonRequestJsonApi,
    addonType: string
  ): Observable<ConfiguredAddonResponseJsonApi> {
    return this.jsonApiService
      .post<
        JsonApiResponse<ConfiguredAddonResponseJsonApi, null>
      >(`${this.apiUrl}/configured-${addonType}-addons/`, addonRequestPayload)
      .pipe(map((response) => response.data));
  }

  updateConfiguredAddon(
    addonRequestPayload: ConfiguredAddonRequestJsonApi,
    addonType: string,
    addonId: string
  ): Observable<ConfiguredAddonResponseJsonApi> {
    return this.jsonApiService.patch<ConfiguredAddonResponseJsonApi>(
      `${this.apiUrl}/configured-${addonType}-addons/${addonId}/`,
      addonRequestPayload
    );
  }

  createAddonOperationInvocation(
    invocationRequestPayload: OperationInvocationRequestJsonApi
  ): Observable<OperationInvocation> {
    return this.jsonApiService
      .post<
        JsonApiResponse<OperationInvocationResponseJsonApi, null>
      >(`${this.apiUrl}/addon-operation-invocations/`, invocationRequestPayload)
      .pipe(map((response) => AddonMapper.fromOperationInvocationResponse(response.data)));
  }

  deleteAuthorizedAddon(id: string, addonType: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/authorized-${addonType}-accounts/${id}/`);
  }

  deleteConfiguredAddon(id: string, addonType: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/${addonType}/${id}/`);
  }
}
