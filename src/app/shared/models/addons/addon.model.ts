export interface AddonModel {
  id: string;
  type: string;
  displayName: string;
  externalServiceName: string;
  iconUrl?: string;
  supportedFeatures?: string[];
  providerName?: string;
  credentialsFormat?: string;
  authUrl?: string | null;
  authorizedCapabilities?: string[];
  authorizedOperationNames?: string[];
  credentialsAvailable?: boolean;
  supportedResourceTypes?: string[];
  wbKey?: string;
}

export interface AddonCardModel {
  id: string;
  type: string;
  displayName: string;
  externalServiceName: string;
  iconUrl?: string;
  isConfigured: boolean;
  addon: AddonModel;
  configuredAddon?: ConfiguredAddonModel;
}

export interface AuthorizedAccountModel extends AddonModel {
  authUrl: string | null;
  authorizedCapabilities: string[];
  authorizedOperationNames: string[];
  credentialsAvailable: boolean;
  apiBaseUrl: string;
  defaultRootFolder: string;
  oauthToken: string;
  accountOwnerId: string;
  externalStorageServiceId: string;
}

export interface ConfiguredAddonModel extends AddonModel {
  connectedCapabilities: string[];
  connectedOperationNames: string[];
  currentUserIsOwner: boolean;
  selectedStorageItemId: string;
  resourceType?: string;
  targetUrl?: string;
  baseAccountId: string;
  baseAccountType: string;
  externalStorageServiceId?: string;
  rootFolderId?: string;
}
