export interface AddonModel {
  id: string;
  type: string;
  displayName: string;
  externalServiceName: string;
  iconUrl?: string;
  supportedFeatures?: string[];
  providerName?: string;
  credentialsFormat?: string;
  configurableApiRoot?: boolean;
  authUrl?: string | null;
  authorizedCapabilities?: string[];
  authorizedOperationNames?: string[];
  credentialsAvailable?: boolean;
  supportedResourceTypes?: string[];
  wbKey?: string;
}
