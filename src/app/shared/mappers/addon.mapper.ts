import {
  AddonGetResponseJsonApi,
  AddonModel,
  AuthorizedAccountModel,
  AuthorizedAddonGetResponseJsonApi,
  ConfiguredAddonGetResponseJsonApi,
  ConfiguredStorageAddonModel,
  IncludedAddonData,
  OperationInvocation,
  OperationInvocationResponseJsonApi,
  StorageItemResponseJsonApi,
} from '../models';

export class AddonMapper {
  static fromResponse(response: AddonGetResponseJsonApi): AddonModel {
    return {
      type: response.type,
      id: response.id,
      wbKey: response.attributes.wb_key,
      authUrl: response.attributes.auth_uri,
      displayName: response.attributes.display_name,
      externalServiceName: response.attributes.external_service_name,
      supportedFeatures: response.attributes.supported_features,
      credentialsFormat: response.attributes.credentials_format,
      providerName: response.attributes.display_name,
    };
  }

  static fromAuthorizedAddonResponse(
    response: AuthorizedAddonGetResponseJsonApi,
    included?: IncludedAddonData[]
  ): AuthorizedAccountModel {
    const externalServiceData =
      response.relationships?.external_storage_service?.data || response.relationships?.external_citation_service?.data;

    const externalServiceId = externalServiceData?.id;

    const matchingService = included?.find(
      (item) =>
        (item.type === 'external-storage-services' || item.type === 'external-citation-services') &&
        item.id === externalServiceId
    )?.attributes;

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
      oauthToken: response.attributes.oauth_token,
      accountOwnerId: response.relationships.account_owner.data.id,
      externalStorageServiceId: externalServiceId || '',
      externalServiceName,
      supportedFeatures,
      credentialsFormat,
      providerName: displayName,
    };
  }

  /**
   * Maps a JSON:API-formatted response object into a `ConfiguredAddon` domain model.
   *
   * @param response - The raw API response object representing a configured addon.
   * This must conform to the `ConfiguredAddonGetResponseJsonApi` structure.
   *
   * @returns A `ConfiguredAddon` object with normalized and flattened properties
   * for application use.
   *
   * @example
   * const addon = AddonMapper.fromConfiguredAddonResponse(apiResponse);
   */
  static fromConfiguredAddonResponse(response: ConfiguredAddonGetResponseJsonApi): ConfiguredStorageAddonModel {
    return {
      type: response.type,
      id: response.id,
      displayName: response.attributes.display_name,
      externalServiceName: response.attributes.external_service_name,
      selectedFolderId: response.attributes.root_folder,
      connectedCapabilities: response.attributes.connected_capabilities,
      connectedOperationNames: response.attributes.connected_operation_names,
      currentUserIsOwner: response.attributes.current_user_is_owner,
      baseAccountId: response.relationships.base_account.data.id,
      baseAccountType: response.relationships.base_account.data.type,
      externalStorageServiceId: response.relationships?.external_storage_service?.data?.id,
    };
  }

  static fromOperationInvocationResponse(response: OperationInvocationResponseJsonApi): OperationInvocation {
    const operationResult = response.attributes.operation_result;
    // [NM] TODO: Double check this condition
    // const isOperationResult = 'items' in operationResult && 'total_count' in operationResult;
    const isOperationResult = 'items' in operationResult;

    const mappedOperationResult = isOperationResult
      ? operationResult.items.map((item: StorageItemResponseJsonApi) => ({
          itemId: item.item_id,
          itemName: item.item_name,
          itemType: item.item_type,
          canBeRoot: item.can_be_root,
          mayContainRootCandidates: item.may_contain_root_candidates,
        }))
      : [
          {
            itemId: operationResult.item_id,
            itemName: operationResult.item_name,
            itemType: operationResult.item_type,
            canBeRoot: operationResult.can_be_root,
            mayContainRootCandidates: operationResult.may_contain_root_candidates,
          },
        ];
    return {
      type: response.type,
      id: response.id,
      invocationStatus: response.attributes.invocation_status,
      operationName: response.attributes.operation_name,
      operationKwargs: {
        itemId: response.attributes.operation_kwargs.item_id,
        itemType: response.attributes.operation_kwargs.item_type,
      },
      itemCount: isOperationResult ? operationResult.total_count : 0,
      operationResult: mappedOperationResult,
    };
  }
}
