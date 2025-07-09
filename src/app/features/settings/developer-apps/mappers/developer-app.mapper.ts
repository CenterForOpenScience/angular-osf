import {
  DeveloperApp,
  DeveloperAppCreateRequestJsonApi,
  DeveloperAppCreateUpdate,
  DeveloperAppGetResponseJsonApi,
  DeveloperAppUpdateRequestJsonApi,
} from '../models';

export class DeveloperAppMapper {
  static toCreateRequest(developerCreate: DeveloperAppCreateUpdate): DeveloperAppCreateRequestJsonApi {
    return {
      data: {
        attributes: {
          name: developerCreate.name,
          description: developerCreate.description,
          home_url: developerCreate.projHomePageUrl,
          callback_url: developerCreate.authorizationCallbackUrl,
        },
        type: 'applications',
      },
    };
  }

  static toUpdateRequest(developerUpdate: DeveloperAppCreateUpdate): DeveloperAppUpdateRequestJsonApi {
    return {
      data: {
        id: developerUpdate.id!,
        attributes: {
          name: developerUpdate.name,
          description: developerUpdate.description,
          home_url: developerUpdate.projHomePageUrl,
          callback_url: developerUpdate.authorizationCallbackUrl,
        },
        type: 'applications',
      },
    };
  }

  static toResetSecretRequest(clientId: string) {
    return {
      data: {
        id: clientId,
        type: 'applications',
        attributes: {
          client_secret: null,
        },
      },
    };
  }

  static fromGetResponse(response: DeveloperAppGetResponseJsonApi): DeveloperApp {
    return {
      id: response.id,
      name: response.attributes.name,
      projHomePageUrl: response.attributes.home_url,
      description: response.attributes.description,
      authorizationCallbackUrl: response.attributes.callback_url,
      clientId: response.attributes.client_id,
      clientSecret: response.attributes.client_secret,
    };
  }
}
