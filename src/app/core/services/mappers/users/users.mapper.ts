import { User } from '@core/services/user/user.entity';
import { UserUS } from '@core/services/json-api/underscore-entites/user/user-us.entity';

export function mapUserUStoUser(user: UserUS): User {
  return {
    id: user.id,
    fullName: user.attributes.full_name,
    givenName: user.attributes.given_name,
    familyName: user.attributes.family_name,
    email: user.attributes.email,
  };
}
