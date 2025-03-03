import { Injectable } from '@angular/core';
import { User } from '@core/services/user/user.entity';
import { UserUS } from '@core/services/json-api/underscore-entites/user/user-us.entity';

@Injectable({
  providedIn: 'root',
})
export class UsersMapper {
  mapUserUStoUser(user: UserUS): User {
    return {
      fullName: user.full_name,
      givenName: user.given_name,
    };
  }
}
