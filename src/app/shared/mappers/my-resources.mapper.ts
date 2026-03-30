import { replaceBadEncodedChars } from '@shared/helpers/format-bad-encoding.helper';

import { MyResourcesItem, MyResourcesItemGetResponseJsonApi } from '../models/my-resources/my-resources.model';

import { ContributorsMapper } from './contributors';

export class MyResourcesMapper {
  static fromResponse(response: MyResourcesItemGetResponseJsonApi): MyResourcesItem {
    return {
      id: response.id,
      type: response.type,
      title: replaceBadEncodedChars(response.attributes.title),
      dateCreated: response.attributes.date_created,
      dateModified: response.attributes.date_modified,
      isPublic: response.attributes.public,
      contributors: ContributorsMapper.getContributors(response.embeds?.bibliographic_contributors?.data),
    };
  }
}
