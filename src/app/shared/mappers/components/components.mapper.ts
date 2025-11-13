import { ComponentGetResponseJsonApi } from '@osf/shared/models/components/component-json-api.model';
import { ComponentOverview } from '@osf/shared/models/components/components.models';

import { ContributorsMapper } from '../contributors';

export class ComponentsMapper {
  static fromGetComponentResponse(response: ComponentGetResponseJsonApi): ComponentOverview {
    return {
      id: response.id,
      type: response.type,
      title: response.attributes.title,
      description: response.attributes.description,
      public: response.attributes.public,
      currentUserIsContributor: response.attributes.current_user_is_contributor,
      contributors: ContributorsMapper.getContributors(response?.embeds?.bibliographic_contributors?.data),
      currentUserPermissions: response.attributes?.current_user_permissions || [],
      parentId: response.relationships.parent?.data?.id,
    };
  }
}
