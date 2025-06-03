import { Addon, AddonResponse, AuthorizedAddon, UserReference } from '@shared/models';

export interface AddonsStateModel {
  storageAddons: Addon[];
  citationAddons: Addon[];
  authorizedStorageAddons: AuthorizedAddon[];
  authorizedCitationAddons: AuthorizedAddon[];
  addonsUserReference: UserReference[];
  createdUpdatedAuthorizedAddon: AddonResponse | null;
}
