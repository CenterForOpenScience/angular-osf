import { ContributorsMapper } from '@osf/shared/mappers/contributors';
import { BaseNodeDataJsonApi } from '@osf/shared/models/nodes/base-node-data-json-api.model';
import { replaceBadEncodedChars } from '@shared/helpers/format-bad-encoding.helper';

import { LinkedNode } from '../models';

export class LinkedNodesMapper {
  static fromApiResponse(apiNode: BaseNodeDataJsonApi): LinkedNode {
    return {
      id: apiNode.id,
      title: replaceBadEncodedChars(apiNode.attributes.title),
      description: replaceBadEncodedChars(apiNode.attributes.description),
      category: apiNode.attributes.category,
      dateCreated: apiNode.attributes.date_created,
      dateModified: apiNode.attributes.date_modified,
      tags: apiNode.attributes.tags || [],
      isPublic: apiNode.attributes.public,
      contributors: ContributorsMapper.getContributors(apiNode.embeds?.bibliographic_contributors?.data) || [],
    };
  }
}
