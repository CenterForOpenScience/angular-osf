import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { User } from '@core/services/user/user.entity';
import { UserUS } from '@core/services/json-api/underscore-entites/user/user-us.entity';
import { UsersMapper } from '@core/services/mappers/users/users.mapper';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  jsonApiService = inject(JsonApiService);
  usersMapper = inject(UsersMapper);

  getMe(): Observable<User> {
    return this.jsonApiService
      .get<UserUS>('https://api.test.osf.io/v2/users/me')
      .pipe(map((user) => this.usersMapper.mapUserUStoUser(user)));
  }
}
