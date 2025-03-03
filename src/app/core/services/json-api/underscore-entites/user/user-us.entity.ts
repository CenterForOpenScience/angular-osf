import { User } from '@core/services/user/user.entity';

export class UserUS {
  full_name = '';
  given_name = '';

  toUser(): User {
    return {
      fullName: this.full_name,
      givenName: this.given_name,
    };
  }
}
