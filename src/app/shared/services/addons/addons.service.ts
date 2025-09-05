import { select } from '@ngxs/store';

import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { UserSelectors } from '@core/store/user';
import { AddonMapper } from '@shared/mappers';
import {
  AddonGetResponseJsonApi,
  AddonModel,
  AuthorizedAccountModel,
  AuthorizedAddonGetResponseJsonApi,
  AuthorizedAddonRequestJsonApi,
  AuthorizedAddonResponseJsonApi,
  ConfiguredAddonGetResponseJsonApi,
  ConfiguredAddonRequestJsonApi,
  ConfiguredAddonResponseJsonApi,
  ConfiguredStorageAddonModel,
  IncludedAddonData,
  JsonApiResponse,
  OperationInvocation,
  OperationInvocationRequestJsonApi,
  ResourceReferenceJsonApi,
  UserReferenceJsonApi,
} from '@shared/models';
import { OperationInvocationResponseJsonApi } from '@shared/models/addons/operation-invocation.models';
import { JsonApiService } from '@shared/services';

import { environment } from 'src/environments/environment';

/**
 * Service for managing addon-related operations within the OSF platform.
 *
 * This service provides methods for retrieving, configuring, and interacting
 * with external storage service addons (e.g., Google Drive, Dropbox).
 * It communicates with the OSF Addons API and maps responses into domain models.
 *
 * Used by components and state layers to facilitate addon workflows such as
 * integration configuration, credential management, and supported feature handling.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class AddonsService {
  /**
   * Injected instance of the JSON:API service used for making API requests.
   * This service handles standardized JSON:API request and response formatting.
   */
  private jsonApiService = inject(JsonApiService);

  /**
   * Signal holding the current authenticated user from the global NGXS store.
   * Typically used for access control, display logic, or personalized API calls.
   */
  private currentUser = select(UserSelectors.getCurrentUser);

  /**
   * Retrieves a list of external storage service addons by type.
   *
   * @param addonType - The addon type to fetch (e.g., 'storage').
   * @returns Observable emitting an array of mapped Addon objects.
   *
   */
  getAddons(addonType: string): Observable<AddonModel[]> {
    return this.jsonApiService
      .get<
        JsonApiResponse<AddonGetResponseJsonApi[], null>
      >(`${environment.addonsApiUrl}/external-${addonType}-services`)
      .pipe(map((response) => response.data.map((item) => AddonMapper.fromResponse(item))));
  }

  getAddonsUserReference(): Observable<UserReferenceJsonApi[]> {
    const currentUser = this.currentUser();
    if (!currentUser) throw new Error('Current user not found');

    const userUri = `${environment.webUrl}/${currentUser.id}`;
    const params = {
      'filter[user_uri]': userUri,
    };

    return this.jsonApiService
      .get<JsonApiResponse<UserReferenceJsonApi[], null>>(environment.addonsApiUrl + '/user-references/', params)
      .pipe(map((response) => response.data));
  }

  getAddonsResourceReference(resourceId: string): Observable<ResourceReferenceJsonApi[]> {
    const resourceUri = `${environment.webUrl}/${resourceId}`;
    const params = {
      'filter[resource_uri]': resourceUri,
    };

    return this.jsonApiService
      .get<
        JsonApiResponse<ResourceReferenceJsonApi[], null>
      >(environment.addonsApiUrl + '/resource-references/', params)
      .pipe(map((response) => response.data));
  }

  getAuthorizedStorageAddons(addonType: string, referenceId: string): Observable<AuthorizedAccountModel[]> {
    const params = {
      [`fields[external-${addonType}-services]`]: 'external_service_name',
    };
    return this.jsonApiService
      .get<
        JsonApiResponse<AuthorizedAddonGetResponseJsonApi[], IncludedAddonData[]>
      >(`${environment.addonsApiUrl}/user-references/${referenceId}/authorized_${addonType}_accounts/?include=external-${addonType}-service`, params)
      .pipe(
        map((response) => response.data.map((item) => AddonMapper.fromAuthorizedAddonResponse(item, response.included)))
      );
  }

  getAuthorizedStorageOauthToken(accountId: string): Observable<AuthorizedAccountModel> {
    return this.jsonApiService
      .patch<AuthorizedAddonGetResponseJsonApi>(
        `${environment.addonsApiUrl}/authorized-storage-accounts/${accountId}`,
        {
          data: {
            id: accountId,
            type: 'authorized-storage-accounts',
            attributes: {
              serialize_oauth_token: 'true',
            },
          },
        }
      )
      .pipe(
        map((response) => {
          return AddonMapper.fromAuthorizedAddonResponse(response as AuthorizedAddonGetResponseJsonApi);
        })
      );
  }

  /**
   * Retrieves the list of configured addons for a given resource reference.
   *
   * @param addonType - The addon category to retrieve. Valid values: `'citation'` or `'storage'`.
   * @param referenceId - The unique identifier of the resource (e.g., node, registration) that the addons are configured for.
   * @returns An observable that emits an array of {@link ConfiguredStorageAddonModel} objects.
   *
   */
  getConfiguredAddons(addonType: string, referenceId: string): Observable<ConfiguredStorageAddonModel[]> {
    return this.jsonApiService
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
    return this.jsonApiService
      .post<
        JsonApiResponse<AuthorizedAddonResponseJsonApi, null>
      >(`${environment.addonsApiUrl}/authorized-${addonType}-accounts/`, addonRequestPayload)
      .pipe(map((response) => response.data));
  }

  updateAuthorizedAddon(
    addonRequestPayload: AuthorizedAddonRequestJsonApi,
    addonType: string,
    addonId: string
  ): Observable<AuthorizedAddonResponseJsonApi> {
    return this.jsonApiService.patch<AuthorizedAddonResponseJsonApi>(
      `${environment.addonsApiUrl}/authorized-${addonType}-accounts/${addonId}/`,
      addonRequestPayload
    );
  }

  createConfiguredAddon(
    addonRequestPayload: ConfiguredAddonRequestJsonApi,
    addonType: string
  ): Observable<ConfiguredAddonResponseJsonApi> {
    return this.jsonApiService
      .post<
        JsonApiResponse<ConfiguredAddonResponseJsonApi, null>
      >(`${environment.addonsApiUrl}/configured-${addonType}-addons/`, addonRequestPayload)
      .pipe(map((response) => response.data));
  }

  updateConfiguredAddon(
    addonRequestPayload: ConfiguredAddonRequestJsonApi,
    addonType: string,
    addonId: string
  ): Observable<ConfiguredAddonResponseJsonApi> {
    return this.jsonApiService.patch<ConfiguredAddonResponseJsonApi>(
      `${environment.addonsApiUrl}/configured-${addonType}-addons/${addonId}/`,
      addonRequestPayload
    );
  }

  createAddonOperationInvocation(
    invocationRequestPayload: OperationInvocationRequestJsonApi
  ): Observable<OperationInvocation> {
    return this.jsonApiService
      .post<
        JsonApiResponse<OperationInvocationResponseJsonApi, null>
      >(`${environment.addonsApiUrl}/addon-operation-invocations/`, invocationRequestPayload)
      .pipe(
        map((response) => {
          return AddonMapper.fromOperationInvocationResponse(response.data);
        })
      );
  }

  deleteAuthorizedAddon(id: string, addonType: string): Observable<void> {
    return this.jsonApiService.delete(`${environment.addonsApiUrl}/authorized-${addonType}-accounts/${id}/`);
  }

  deleteConfiguredAddon(id: string, addonType: string): Observable<void> {
    return this.jsonApiService.delete(`${environment.addonsApiUrl}/${addonType}/${id}/`);
  }
}
