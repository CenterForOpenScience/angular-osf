import { RegistryComponentModel } from '../models/registry-components.models';
import { RegistryComponentJsonApi } from '../models/registry-components-json-api.model';

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
    };
  }

  static fromApiResponseArray(apiComponents: RegistryComponentJsonApi[]): RegistryComponentModel[] {
    return apiComponents.map(this.fromApiResponse);
  }
}
