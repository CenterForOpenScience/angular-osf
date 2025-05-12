import { UserUS } from '@core/services/json-api/underscore-entites/user/user-us.entity';
import { User } from '@core/services/user/user.entity';

export function mapUserUStoUser(user: UserUS): User {
  return {
    id: user.id,
    fullName: user.attributes.full_name,
    givenName: user.attributes.given_name,
    middleNames: user.attributes.middle_names,
    suffix: user.attributes.suffix,
    familyName: user.attributes.family_name,
    email: user.attributes.email,
    dateRegistered: new Date(user.attributes.date_registered),
    link: user.links.html,
    education: user.attributes.education,
    employment: user.attributes.employment,
    iri: user.links.iri,
    social: user.attributes.social,
  };
}
