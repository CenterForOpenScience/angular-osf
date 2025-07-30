import {
  Addon,
  AsyncStateModel,
  AuthorizedAddon,
  AuthorizedAddonResponseJsonApi,
  ConfiguredAddon,
  ConfiguredAddonResponseJsonApi,
  OperationInvocation,
  ResourceReferenceJsonApi,
  UserReferenceJsonApi,
} from '@osf/shared/models';

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
