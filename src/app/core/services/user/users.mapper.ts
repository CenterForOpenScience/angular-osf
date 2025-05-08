import {
  User,
  UserGetResponse,
  UserSettings,
  UserSettingsGetResponse,
} from '@core/services/user/user.models';

export class UserMapper {
  static fromUserGetResponse(user: UserGetResponse): User {
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

  static fromUserSettingsGetResponse(
    userSettingsResponse: UserSettingsGetResponse,
  ): UserSettings {
    return {
      subscribeOsfGeneralEmail:
        userSettingsResponse.attributes.subscribe_osf_general_email,
      subscribeOsfHelpEmail:
        userSettingsResponse.attributes.subscribe_osf_help_email,
    };
  }
}
