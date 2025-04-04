import { inject, Injectable } from '@angular/core';
import { JsonApiService } from '@core/services/json-api/json-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  jsonApiService = inject(JsonApiService);

  // getMe(): Observable<User> {
  //   return this.jsonApiService
  //     .get<UserUS>('https://api.test.osf.io/v2/users/me')
  //     .pipe(map((user) => mapUserUStoUser(user)));
  // }
}
