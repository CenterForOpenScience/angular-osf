import {
  Addon,
  AuthorizedAddon,
  AddonResponse,
  UserReference,
} from '@osf/features/settings/addons/entities/addons.entities';

export interface AddonsStateModel {
  storageAddons: Addon[];
  citationAddons: Addon[];
  authorizedStorageAddons: AuthorizedAddon[];
  authorizedCitationAddons: AuthorizedAddon[];
  addonsUserReference: UserReference[];
  createdUpdatedAuthorizedAddon: AddonResponse | null;
}
