import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';

import { JsonApiResponse } from '@core/services/json-api/json-api.entity';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { UserUS } from '@core/services/json-api/underscore-entites/user/user-us.entity';
import { mapUserUStoUser } from '@core/services/mappers/users/users.mapper';
import { User } from '@core/services/user/user.entity';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = 'https://api.staging4.osf.io/v2/';
  jsonApiService = inject(JsonApiService);

  getCurrentUser(): Observable<User> {
    return this.jsonApiService
      .get<JsonApiResponse<UserUS, null>>(this.baseUrl + 'users/me')
      .pipe(map((user) => mapUserUStoUser(user.data)));
  }
}
