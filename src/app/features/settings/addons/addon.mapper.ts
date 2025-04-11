import {
  Addon,
  AddonResponse,
  AuthorizedAddon,
  AuthorizedAddonResponse,
  IncludedAddonData,
} from '@osf/features/settings/addons/entities/addons.entities';

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

  static fromAuthorizedAddonResponse(
    response: AuthorizedAddonResponse,
    included?: IncludedAddonData[],
  ): AuthorizedAddon {
    const externalStorageServiceId =
      response.relationships.external_storage_service.data.id;

    const matchingService = included?.find(
      (item) =>
        (item.type === 'external-storage-services' ||
          item.type === 'external-citation-services') &&
        item.id === externalStorageServiceId,
    );

    const externalServiceName =
      (matchingService?.attributes?.['external_service_name'] as string) || '';

    return {
      type: response.type,
      id: response.id,
      displayName: response.attributes.display_name,
      apiBaseUrl: response.attributes.api_base_url,
      authUrl: response.attributes.auth_url,
      authorizedCapabilities: response.attributes.authorized_capabilities,
      authorizedOperationNames: response.attributes.authorized_operation_names,
      defaultRootFolder: response.attributes.default_root_folder,
      credentialsAvailable: response.attributes.credentials_available,
      accountOwnerId: response.relationships.account_owner.data.id,
      externalStorageServiceId:
        response.relationships.external_storage_service.data.id,
      externalServiceName,
    };
  }
}
