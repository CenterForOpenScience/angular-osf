import { ComponentGetResponseJsonApi, ComponentOverview } from '@shared/models';

import { ContributorsMapper } from '../contributors';

export class ComponentsMapper {
  static fromGetComponentResponse(response: ComponentGetResponseJsonApi): ComponentOverview {
    return {
      id: response.id,
      type: response.type,
      title: response.attributes.title,
      description: response.attributes.description,
      public: response.attributes.public,
      contributors: ContributorsMapper.getContributors(response?.embeds?.bibliographic_contributors?.data),
      currentUserPermissions: response.attributes?.current_user_permissions || [],
    };
  }
}
