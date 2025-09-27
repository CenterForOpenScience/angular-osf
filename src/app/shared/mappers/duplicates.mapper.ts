import { ResponseJsonApi } from '@shared/models';

import { DuplicateJsonApi, DuplicatesWithTotal } from '../models/duplicates';

import { ContributorsMapper } from './contributors';

export class DuplicatesMapper {
  static fromDuplicatesJsonApiResponse(response: ResponseJsonApi<DuplicateJsonApi[]>): DuplicatesWithTotal {
    return {
      data: response.data.map((duplicate) => ({
        id: duplicate.id,
        type: duplicate.type,
        title: duplicate.attributes.title,
        description: duplicate.attributes.description,
        dateCreated: duplicate.attributes.forked_date,
        dateModified: duplicate.attributes.date_modified,
        public: duplicate.attributes.public,
        currentUserPermissions: duplicate.attributes.current_user_permissions,
        contributors: ContributorsMapper.getContributors(duplicate.embeds.bibliographic_contributors.data),
      })),
      totalCount: response.meta.total,
    };
  }
}
