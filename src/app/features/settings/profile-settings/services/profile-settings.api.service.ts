import { inject, Injectable } from '@angular/core';

import { JsonApiResponse, UserGetResponse } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';

import { ProfileSettingsStateModel, ProfileSettingsUpdate } from '../store';

@Injectable({
  providedIn: 'root',
})
export class ProfileSettingsApiService {
  readonly #baseUrl = 'https://api.staging4.osf.io/v2/';
  readonly #jsonApiService = inject(JsonApiService);

  patchUserSettings(userId: string, key: keyof ProfileSettingsStateModel, data: ProfileSettingsUpdate) {
    const patchedData = { [key]: data };
    return this.#jsonApiService.patch<JsonApiResponse<UserGetResponse, null>>(`${this.#baseUrl}users/${userId}/`, {
      data: { type: 'users', id: userId, attributes: patchedData },
    });
  }
}
