import { User } from '@core/services/user/user.entity';
import { UserUS } from '@core/services/json-api/underscore-entites/user/user-us.entity';
import { Social } from '@osf/features/settings/profile-settings/social/social.entities';

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

export function mapUserToUserUS(user: Partial<User> | User): Partial<UserUS> {
  return {
    id: user.id,
    type: 'user',
    attributes: {
      date_registered: new Date(user.dateRegistered ?? ''),
      full_name: user.fullName || '',
      given_name: user.givenName || '',
      family_name: user.familyName || '',
      email: user.email,
      employment: user.employment || [],
      education: user.education || [],
      middle_names: user.middleNames,
      suffix: user.suffix,
      social: {} as Social,
    },
    relationships: {},
    links: {},
  };
}
