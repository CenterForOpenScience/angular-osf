import { Addon, AddonResponse } from '@shared/entities/addons.entities';

export class AddonMapper {
  static fromResponse(response: AddonResponse): Addon {
    return {
      type: response.type,
      id: response.id,
      authUri: response.attributes.auth_uri,
      displayName: response.attributes.display_name,
      externalServiceName: response.attributes.external_service_name,
      supportedFeatures: response.attributes.supported_features,
      credentialsFormat: response.attributes.credentials_format,
    };
  }
}
