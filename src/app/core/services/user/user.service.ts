import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { User } from '@core/services/user/user.entity';
import { UserUS } from '@core/services/json-api/underscore-entites/user/user-us.entity';
import { mapUserUStoUser } from '@core/services/mappers/users/users.mapper';
import { JsonApiResponse } from '@core/services/json-api/json-api.entity';

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
