import { AddonModel } from './addon.model';

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
