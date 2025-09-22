export interface Addon {
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

export interface AddonCard {
  id: string;
  type: string;
  displayName: string;
  externalServiceName: string;
  iconUrl?: string;
  isConfigured: boolean;
  addon: Addon;
  configuredAddon?: ConfiguredAddon;
}

export interface AuthorizedAccount extends Addon {
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

export interface ConfiguredAddon extends Addon {
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
