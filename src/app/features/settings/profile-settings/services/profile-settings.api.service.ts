import { inject, Injectable } from '@angular/core';

import { JsonApiResponse, UserGetResponse } from '@osf/core/models';
import { JsonApiService } from '@osf/core/services';

import { ProfileSettingsStateModel, ProfileSettingsUpdate } from '../store';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileSettingsApiService {
  private readonly jsonApiService = inject(JsonApiService);

  patchUserSettings(userId: string, key: keyof ProfileSettingsStateModel, data: ProfileSettingsUpdate) {
    const patchedData = { [key]: data };

    return this.jsonApiService.patch<JsonApiResponse<UserGetResponse, null>>(`${environment.apiUrl}/users/${userId}/`, {
      data: { type: 'users', id: userId, attributes: patchedData },
    });
  }
}
