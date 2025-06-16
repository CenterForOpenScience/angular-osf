import { MyProjectsItem, MyProjectsItemGetResponseJsonApi } from '../models';

export class MyProjectsMapper {
  static fromResponse(response: MyProjectsItemGetResponseJsonApi): MyProjectsItem {
    return {
      id: response.id,
      type: response.type,
      title: response.attributes.title,
      dateModified: response.attributes.date_modified,
      isPublic: response.attributes.public,
      contributors: response.embeds.bibliographic_contributors.data.map((contributor) => ({
        familyName: contributor.embeds.users.data.attributes.family_name,
        fullName: contributor.embeds.users.data.attributes.full_name,
        givenName: contributor.embeds.users.data.attributes.given_name,
        middleName: contributor.embeds.users.data.attributes.middle_name,
      })),
    };
  }
}
