import { ComponentGetResponseJsonApi, ComponentOverview } from '@shared/models';

export class ComponentsMapper {
  static fromGetComponentResponse(response: ComponentGetResponseJsonApi): ComponentOverview {
    return {
      id: response.id,
      type: response.type,
      title: response.attributes.title,
      description: response.attributes.description,
      public: response.attributes.public,
      contributors: response.embeds.bibliographic_contributors.data.map((contributor) => ({
        id: contributor.embeds.users.data.id,
        familyName: contributor.embeds.users.data.attributes.family_name,
        fullName: contributor.embeds.users.data.attributes.full_name,
        givenName: contributor.embeds.users.data.attributes.given_name,
        middleName: contributor.embeds.users.data.attributes.middle_name,
        type: contributor.embeds.users.data.type,
      })),
      currentUserPermissions: response.attributes.current_user_permissions || [],
    };
  }
}
