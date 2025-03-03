import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { JsonApiService } from '@core/services/json-api/json-api.service';
import { User } from '@core/services/user/user.entity';
import { UserUS } from '@core/services/json-api/underscore-entites/user/user-us.entity';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  jsonApiService = inject(JsonApiService);

  getMe(): Observable<User> {
    return this.jsonApiService
      .get<UserUS>('https://api.test.osf.io/v2/users/me')
      .pipe(
        map((response) => {
          const userUs = new UserUS();
          Object.assign(userUs, response);
          return userUs.toUser();
        }),
      );
  }
}
