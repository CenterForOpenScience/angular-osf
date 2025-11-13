import { AddonModel } from './addon.model';

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
