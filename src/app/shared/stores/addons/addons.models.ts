import {
  Addon,
  AuthorizedAddon,
  AuthorizedAddonResponseJsonApi,
  ConfiguredAddon,
  ConfiguredAddonResponseJsonApi,
  OperationInvocation,
  ResourceReferenceJsonApi,
  UserReferenceJsonApi,
} from '@shared/models';
import { AsyncStateModel } from '@shared/models/store';

export interface AddonsStateModel {
  storageAddons: AsyncStateModel<Addon[]>;
  citationAddons: AsyncStateModel<Addon[]>;
  authorizedStorageAddons: AsyncStateModel<AuthorizedAddon[]>;
  authorizedCitationAddons: AsyncStateModel<AuthorizedAddon[]>;
  configuredStorageAddons: AsyncStateModel<ConfiguredAddon[]>;
  configuredCitationAddons: AsyncStateModel<ConfiguredAddon[]>;
  addonsUserReference: AsyncStateModel<UserReferenceJsonApi[]>;
  addonsResourceReference: AsyncStateModel<ResourceReferenceJsonApi[]>;
  createdUpdatedAuthorizedAddon: AsyncStateModel<AuthorizedAddonResponseJsonApi | null>;
  createdUpdatedConfiguredAddon: AsyncStateModel<ConfiguredAddonResponseJsonApi | null>;
  operationInvocation: AsyncStateModel<OperationInvocation | null>;
  selectedFolderOperationInvocation: AsyncStateModel<OperationInvocation | null>;
}
