import { ContributorsMapper } from '@osf/shared/mappers';
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
      contributors: ContributorsMapper.getContributors(response.embeds?.bibliographic_contributors?.data),
    };
  }
}
