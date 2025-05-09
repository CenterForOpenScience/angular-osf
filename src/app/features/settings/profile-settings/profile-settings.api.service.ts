import { inject, Injectable } from '@angular/core';

import { JsonApiService } from '@core/services/json-api/json-api.service';
import { UserGetResponse } from '@core/services/user/user.models';
import { JsonApiResponse } from '@osf/core/services/json-api/json-api.entity';
import {
  ProfileSettingsStateModel,
  ProfileSettingsUpdate,
} from '@osf/features/settings/profile-settings/profile-settings.entities';

@Injectable({
  providedIn: 'root',
})
export class ProfileSettingsApiService {
  readonly #baseUrl = 'https://api.staging4.osf.io/v2/';
  readonly #jsonApiService = inject(JsonApiService);

  patchUserSettings(
    userId: string,
    key: keyof ProfileSettingsStateModel,
    data: ProfileSettingsUpdate,
  ) {
    const patchedData = { [key]: data };
    return this.#jsonApiService.patch<JsonApiResponse<UserGetResponse, null>>(
      `${this.#baseUrl}users/${userId}/`,
      { data: { type: 'users', id: userId, attributes: patchedData } },
    );
  }
}
