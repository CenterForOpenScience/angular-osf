import { select } from '@ngxs/store';

import { map, Observable } from 'rxjs';

import { HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { BYPASS_ERROR_INTERCEPTOR } from '@core/interceptors/error-interceptor.tokens';
import { ENVIRONMENT } from '@core/provider/environment.provider';
import { UserSelectors } from '@core/store/user';
import { AddonMapper } from '@osf/shared/mappers/addon.mapper';
import { AddonModel } from '@osf/shared/models/addons/addon.model';
import {
  OperationInvocationRequestJsonApi,
  OperationInvocationResponseJsonApi,
} from '@osf/shared/models/addons/addon-operations-json-api.model';
import {
  ResourceReferenceJsonApi,
  ResourceReferenceResponseJsonApi,
  UserReferenceJsonApi,
  UserReferenceResponseJsonApi,
} from '@osf/shared/models/addons/addon-reference-json-api.model';
import { AuthorizedAccountModel } from '@osf/shared/models/addons/authorized-account.model';
import {
  AuthorizedAddonDataJsonApi,
  AuthorizedAddonListResponseJsonApi,
  AuthorizedAddonRequestJsonApi,
  AuthorizedAddonResponseJsonApi,
} from '@osf/shared/models/addons/authorized-addon-json-api.model';
import { ConfiguredAddonModel } from '@osf/shared/models/addons/configured-addon.model';
import {
  ConfiguredAddonDataJsonApi,
  ConfiguredAddonItemResponseJsonApi,
  ConfiguredAddonListResponseWithIncludeJsonApi,
  ConfiguredAddonRequestJsonApi,
} from '@osf/shared/models/addons/configured-addon-json-api.model';
import { AddonGetListResponseJsonApi } from '@osf/shared/models/addons/external-addon-json-api.model';
import { OperationInvocation } from '@osf/shared/models/addons/operation-invocation.model';

import { JsonApiService } from '../json-api.service';

@Injectable({
  providedIn: 'root',
})
export class AddonsService {
  private readonly jsonApiService = inject(JsonApiService);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return this.environment.addonsApiUrl;
  }

  get webUrl() {
    return this.environment.webUrl;
  }

  private readonly currentUser = select(UserSelectors.getCurrentUser);

  getAddons(addonType: string): Observable<AddonModel[]> {
    return this.jsonApiService
      .get<AddonGetListResponseJsonApi>(`${this.apiUrl}/external-${addonType}-services`)
      .pipe(map((response) => response.data.map((item) => AddonMapper.fromResponse(item))));
  }

  getAddonsUserReference(): Observable<UserReferenceJsonApi[]> {
    const currentUser = this.currentUser();
    if (!currentUser) throw new Error('Current user not found');

    const userUri = `${this.webUrl}/${currentUser.id}`;
    const params = { 'filter[user_uri]': userUri };

    return this.jsonApiService
      .get<UserReferenceResponseJsonApi>(this.apiUrl + '/user-references/', params)
      .pipe(map((response) => response.data));
  }

  getAddonsResourceReference(resourceId: string): Observable<ResourceReferenceJsonApi[]> {
    const resourceUri = `${this.webUrl}/${resourceId}`;
    const params = { 'filter[resource_uri]': resourceUri };

    return this.jsonApiService
      .get<ResourceReferenceResponseJsonApi>(this.apiUrl + '/resource-references/', params)
      .pipe(map((response) => response.data));
  }

  getAuthorizedAddons(addonType: string, referenceId: string): Observable<AuthorizedAccountModel[]> {
    const params = {
      [`fields[external-${addonType}-services]`]: 'external_service_name,credentials_format,icon_url',
    };
    return this.jsonApiService
      .get<AuthorizedAddonListResponseJsonApi>(
        `${this.apiUrl}/user-references/${referenceId}/authorized_${addonType}_accounts/?include=external-${addonType}-service`,
        params
      )
      .pipe(
        map((response) => response.data.map((item) => AddonMapper.fromAuthorizedAddonResponse(item, response.included)))
      );
  }

  getAuthorizedStorageOauthToken(accountId: string, addonType: string): Observable<AuthorizedAccountModel> {
    const context = new HttpContext();
    context.set(BYPASS_ERROR_INTERCEPTOR, true);

    return this.jsonApiService
      .patch<AuthorizedAddonDataJsonApi>(
        `${this.apiUrl}/authorized-${addonType}-accounts/${accountId}`,
        {
          data: {
            id: accountId,
            type: `authorized-${addonType}-accounts`,
            attributes: { serialize_oauth_token: 'true' },
          },
        },
        {},
        {},
        context
      )
      .pipe(map((response) => AddonMapper.fromAuthorizedAddonResponse(response as AuthorizedAddonDataJsonApi)));
  }

  getConfiguredAddons(addonType: string, referenceId: string): Observable<ConfiguredAddonModel[]> {
    const params = {
      [`fields[external-${addonType}-services]`]: 'external_service_name,credentials_format,icon_url',
    };
    return this.jsonApiService
      .get<ConfiguredAddonListResponseWithIncludeJsonApi>(
        `${this.apiUrl}/resource-references/${referenceId}/configured_${addonType}_addons/?include=external-${addonType}-service`,
        params
      )
      .pipe(
        map((response) => response.data.map((item) => AddonMapper.fromConfiguredAddonResponse(item, response.included)))
      );
  }

  createAuthorizedAddon(
    addonRequestPayload: AuthorizedAddonRequestJsonApi,
    addonType: string
  ): Observable<AuthorizedAccountModel> {
    return this.jsonApiService
      .post<AuthorizedAddonResponseJsonApi>(
        `${this.apiUrl}/authorized-${addonType}-accounts/?include=external-${addonType}-service`,
        addonRequestPayload
      )
      .pipe(map((response) => AddonMapper.fromAuthorizedAddonResponse(response.data, response.included)));
  }

  updateAuthorizedAddon(
    addonRequestPayload: AuthorizedAddonRequestJsonApi,
    addonType: string,
    addonId: string
  ): Observable<AuthorizedAccountModel> {
    return this.jsonApiService.http
      .patch<AuthorizedAddonResponseJsonApi>(
        `${this.apiUrl}/authorized-${addonType}-accounts/${addonId}/?include=external-${addonType}-service`,
        addonRequestPayload
      )
      .pipe(map((response) => AddonMapper.fromAuthorizedAddonResponse(response.data, response.included)));
  }

  createConfiguredAddon(
    addonRequestPayload: ConfiguredAddonRequestJsonApi,
    addonType: string
  ): Observable<ConfiguredAddonDataJsonApi> {
    return this.jsonApiService
      .post<ConfiguredAddonItemResponseJsonApi>(`${this.apiUrl}/configured-${addonType}-addons/`, addonRequestPayload)
      .pipe(map((response) => response.data));
  }

  updateConfiguredAddon(
    addonRequestPayload: ConfiguredAddonRequestJsonApi,
    addonType: string,
    addonId: string
  ): Observable<ConfiguredAddonDataJsonApi> {
    return this.jsonApiService.patch<ConfiguredAddonDataJsonApi>(
      `${this.apiUrl}/configured-${addonType}-addons/${addonId}/`,
      addonRequestPayload
    );
  }

  createAddonOperationInvocation(
    invocationRequestPayload: OperationInvocationRequestJsonApi
  ): Observable<OperationInvocation> {
    return this.jsonApiService
      .post<OperationInvocationResponseJsonApi>(`${this.apiUrl}/addon-operation-invocations/`, invocationRequestPayload)
      .pipe(map((response) => AddonMapper.fromOperationInvocationResponse(response.data)));
  }

  deleteAuthorizedAddon(id: string, addonType: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/authorized-${addonType}-accounts/${id}/`);
  }

  deleteConfiguredAddon(id: string, addonType: string): Observable<void> {
    return this.jsonApiService.delete(`${this.apiUrl}/${addonType}/${id}/`);
  }
}
