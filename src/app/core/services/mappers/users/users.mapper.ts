import { User } from '@core/services/user/user.entity';
import { UserUS } from '@core/services/json-api/underscore-entites/user/user-us.entity';

export function mapUserUStoUser(user: UserUS): User {
  return {
    fullName: user.full_name,
    givenName: user.given_name,
  };
}
