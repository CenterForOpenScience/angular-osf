import { MyResourcesItem, MyResourcesItemGetResponseJsonApi } from '@osf/shared/models';

export class MyResourcesMapper {
  static fromResponse(response: MyResourcesItemGetResponseJsonApi): MyResourcesItem {
    return {
      id: response.id,
      type: response.type,
      title: response.attributes.title,
      dateCreated: response.attributes.date_created,
      dateModified: response.attributes.date_modified,
      isPublic: response.attributes.public,
      contributors:
        response.embeds?.bibliographic_contributors?.data?.map((contributor) => ({
          familyName: contributor.embeds.users.data.attributes.family_name,
          fullName: contributor.embeds.users.data.attributes.full_name,
          givenName: contributor.embeds.users.data.attributes.given_name,
          middleName: contributor.embeds.users.data.attributes.middle_name,
        })) ?? [],
    };
  }
}
