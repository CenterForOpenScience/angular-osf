import {
  Addon,
  AddonResponse,
  AuthorizedAddon,
  ConfiguredAddon,
  ResourceReference,
  UserReference,
} from '@shared/models';
import { AsyncStateModel } from '@shared/models/store';

export interface AddonsStateModel {
  storageAddons: AsyncStateModel<Addon[]>;
  citationAddons: AsyncStateModel<Addon[]>;
  authorizedStorageAddons: AsyncStateModel<AuthorizedAddon[]>;
  authorizedCitationAddons: AsyncStateModel<AuthorizedAddon[]>;
  configuredStorageAddons: AsyncStateModel<ConfiguredAddon[]>;
  configuredCitationAddons: AsyncStateModel<ConfiguredAddon[]>;
  addonsUserReference: AsyncStateModel<UserReference[]>;
  addonsResourceReference: AsyncStateModel<ResourceReference[]>;
  createdUpdatedAuthorizedAddon: AsyncStateModel<AddonResponse | null>;
}
