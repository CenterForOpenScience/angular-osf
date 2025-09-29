import { ContributorsMapper } from '@osf/shared/mappers';

import { RegistryComponentJsonApi, RegistryComponentModel } from '../models';

export class RegistryComponentsMapper {
  static fromApiResponse(apiComponent: RegistryComponentJsonApi): RegistryComponentModel {
    return {
      id: apiComponent.id,
      title: apiComponent.attributes.title,
      description: apiComponent.attributes.description,
      category: apiComponent.attributes.category,
      dateCreated: apiComponent.attributes.date_created,
      dateModified: apiComponent.attributes.date_modified,
      dateRegistered: apiComponent.attributes.date_registered,
      registrationSupplement: apiComponent.attributes.registration_supplement,
      tags: apiComponent.attributes.tags,
      isPublic: apiComponent.attributes.public,
      contributors: ContributorsMapper.getContributors(apiComponent.embeds.bibliographic_contributors.data) || [],
    };
  }

  static fromApiResponseArray(apiComponents: RegistryComponentJsonApi[]): RegistryComponentModel[] {
    return apiComponents.map(this.fromApiResponse);
  }
}
