import {
  UserAcceptedTermsOfServiceJsonApi,
  UserAttributesJsonApi,
  UserData,
  UserDataJsonApi,
  UserDataResponseJsonApi,
  UserModel,
} from '@osf/shared/models';

export class UserMapper {
  static fromUserDataGetResponse(response: UserDataResponseJsonApi): UserData {
    return {
      activeFlags: response.meta.active_flags,
      currentUser: response.meta.current_user?.data ? this.fromUserGetResponse(response.meta.current_user.data) : null,
    };
  }

  static fromUserGetResponse(user: UserDataJsonApi): UserModel {
    return {
      id: user.id,
      acceptedTermsOfService: user.attributes.accepted_terms_of_service,
      active: user.attributes.active,
      allowIndexing: user.attributes?.allow_indexing,
      fullName: user.attributes.full_name,
      givenName: user.attributes.given_name,
      middleNames: user.attributes.middle_names,
      suffix: user.attributes.suffix,
      familyName: user.attributes.family_name,
      dateRegistered: user.attributes.date_registered,
      link: user.links.html,
      education: user.attributes.education,
      employment: user.attributes.employment,
      iri: user.links.iri,
      social: user.attributes.social,
      defaultRegionId: user.relationships?.default_region?.data?.id,
      canViewReviews: user.attributes.can_view_reviews === true, // [NS] Do not simplify it
      timezone: user.attributes.timezone,
      locale: user.attributes.locale,
    };
  }

  static toNamesRequest(name: Partial<UserModel>): Partial<UserAttributesJsonApi> {
    return {
      full_name: name.fullName ?? '',
      given_name: name.givenName ?? '',
      family_name: name.familyName ?? '',
      middle_names: name.middleNames ?? '',
      suffix: name.suffix ?? '',
    };
  }

  static toAcceptedTermsOfServiceRequest(name: Partial<UserModel>): UserAcceptedTermsOfServiceJsonApi {
    return {
      accepted_terms_of_service: name.acceptedTermsOfService ?? false,
    };
  }
}
