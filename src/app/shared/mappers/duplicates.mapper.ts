import { ResponseJsonApi } from '@shared/models';

import { DuplicateJsonApi, DuplicatesWithTotal } from 'src/app/shared/models/duplicates';

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
        contributors: duplicate.embeds.bibliographic_contributors.data.map((contributor) => ({
          familyName: contributor.embeds.users.data.attributes.family_name,
          fullName: contributor.embeds.users.data.attributes.full_name,
          givenName: contributor.embeds.users.data.attributes.given_name,
          middleName: contributor.embeds.users.data.attributes.middle_name,
          id: contributor.embeds.users.data.id,
          type: contributor.embeds.users.data.type,
        })),
      })),
      totalCount: response.meta.total,
    };
  }
}
