import {
  Addon,
  AddonGetResponse,
  AuthorizedAddon,
  AuthorizedAddonGetResponse,
  IncludedAddonData,
} from '@osf/features/settings/addons/entities/addons.entities';

export class AddonMapper {
  static fromResponse(response: AddonGetResponse): Addon {
    return {
      type: response.type,
      id: response.id,
      authUrl: response.attributes.auth_uri,
      displayName: response.attributes.display_name,
      externalServiceName: response.attributes.external_service_name,
      supportedFeatures: response.attributes.supported_features,
      credentialsFormat: response.attributes.credentials_format,
      providerName: response.attributes.display_name,
    };
  }

  static fromAuthorizedAddonResponse(
    response: AuthorizedAddonGetResponse,
    included?: IncludedAddonData[]
  ): AuthorizedAddon {
    // Handle both storage and citation service relationships
    const externalServiceData =
      response.relationships?.external_storage_service?.data || response.relationships?.external_citation_service?.data;

    const externalServiceId = externalServiceData?.id;

    // Find the matching service in the included data
    const matchingService = included?.find(
      (item) =>
        (item.type === 'external-storage-services' || item.type === 'external-citation-services') &&
        item.id === externalServiceId
    )?.attributes;

    // Extract the relevant properties from the matching service
    const externalServiceName = (matchingService?.['external_service_name'] as string) || '';
    const displayName = (matchingService?.['display_name'] as string) || '';
    const credentialsFormat = (matchingService?.['credentials_format'] as string) || '';
    const supportedFeatures = (matchingService?.['supported_features'] as string[]) || [];

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
      externalStorageServiceId: externalServiceId || '',
      externalServiceName,
      supportedFeatures,
      credentialsFormat,
      providerName: displayName,
    };
  }
}
