import {
  UserAcceptedTermsOfServiceJsonApi,
  UserAttributesJsonApi,
  UserData,
  UserDataErrorResponseJsonApi,
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

  static getUserInfo(response: UserDataErrorResponseJsonApi | undefined): Partial<UserModel> | null {
    if (!response) {
      return null;
    }

    const data = response.data;
    const errors = response.errors;
    const errorMeta = errors && errors.length > 0 ? errors[0].meta : null;

    return {
      id: errorMeta ? undefined : data?.id,
      fullName: errorMeta ? errorMeta?.full_name : data?.attributes?.full_name || '',
      givenName: errorMeta ? errorMeta?.given_name : data?.attributes?.given_name || '',
      familyName: errorMeta ? errorMeta?.family_name : data?.attributes?.family_name || '',
      education: errorMeta ? [] : data?.attributes?.education || [],
      employment: errorMeta ? [] : data?.attributes?.employment || [],
    };
  }
}
