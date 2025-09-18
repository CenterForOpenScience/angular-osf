export interface ConfiguredAddonModel {
  type: string;
  id: string;
  displayName: string;
  externalServiceName: string;
  selectedStorageItemId: string;
  resourceType?: string;
  targetUrl?: string;
  connectedCapabilities: string[];
  connectedOperationNames: string[];
  currentUserIsOwner: boolean;
  baseAccountId: string;
  baseAccountType: string;
  externalStorageServiceId?: string;
  rootFolderId?: string;
  iconUrl?: string;
}
