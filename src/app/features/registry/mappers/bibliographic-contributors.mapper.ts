import { BibliographicContributorJsonApi, NodeBibliographicContributor } from '../models';

export class BibliographicContributorsMapper {
  static fromApiResponse(contributor: BibliographicContributorJsonApi): NodeBibliographicContributor {
    const userData = contributor.embeds.users.data;

    return {
      id: contributor.id,
      userId: userData.id,
      fullName: userData.attributes.full_name,
      givenName: userData.attributes.given_name,
      middleNames: userData.attributes.middle_names,
      familyName: userData.attributes.family_name,
      suffix: userData.attributes.suffix,
      dateRegistered: userData.attributes.date_registered,
      isActive: userData.attributes.active,
      timezone: userData.attributes.timezone,
      locale: userData.attributes.locale,
      profileImage: userData.links.profile_image,
      profileUrl: userData.links.html,
      permission: contributor.attributes.permission,
      isBibliographic: contributor.attributes.bibliographic,
      isCurator: contributor.attributes.is_curator,
    };
  }

  static fromApiResponseArray(contributors: BibliographicContributorJsonApi[]): NodeBibliographicContributor[] {
    return contributors.map(this.fromApiResponse);
  }
}
