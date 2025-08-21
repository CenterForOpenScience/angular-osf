import {
  AddonModel,
  AsyncStateModel,
  AuthorizedAddon,
  AuthorizedAddonResponseJsonApi,
  ConfiguredAddonResponseJsonApi,
  ConfiguredStorageAddonModel,
  OperationInvocation,
  ResourceReferenceJsonApi,
  UserReferenceJsonApi,
} from '@osf/shared/models';

/**
 * Represents the full NGXS state model for addon-related data within the application.
 *
 * This state structure manages async lifecycle and data for all addon types,
 * including storage and citation addons, both authorized and configured.
 * It also includes references for addon-user and addon-resource relationships
 * as well as operation invocation results.
 *
 * Each field is wrapped in `AsyncStateModel<T>` to track loading, success, and error states.
 */
export interface AddonsStateModel {
  /**
   * Async state for available external storage addons (e.g., Google Drive, Dropbox).
   */
  storageAddons: AsyncStateModel<AddonModel[]>;

  /**
   * Async state for available external citation addons (e.g., Zotero, Mendeley).
   */
  citationAddons: AsyncStateModel<AddonModel[]>;

  /**
   * Async state for authorized external storage addons linked to the current user.
   */
  authorizedStorageAddons: AsyncStateModel<AuthorizedAddon[]>;

  /**
   * Async state for authorized external citation addons linked to the current user.
   */
  authorizedCitationAddons: AsyncStateModel<AuthorizedAddon[]>;

  /**
   * Async state for storage addons that have been configured on a resource (e.g., project, node).
   */
  configuredStorageAddons: AsyncStateModel<ConfiguredStorageAddonModel[]>;

  /**
   * Async state for citation addons that have been configured on a resource (e.g., project, node).
   */
  configuredCitationAddons: AsyncStateModel<ConfiguredStorageAddonModel[]>;

  /**
   * Async state holding user-level references for addon configuration.
   */
  addonsUserReference: AsyncStateModel<UserReferenceJsonApi[]>;

  /**
   * Async state holding resource-level references for addon configuration.
   */
  addonsResourceReference: AsyncStateModel<ResourceReferenceJsonApi[]>;

  /**
   * Async state for the result of a create or update action on an authorized addon.
   */
  createdUpdatedAuthorizedAddon: AsyncStateModel<AuthorizedAddonResponseJsonApi | null>;

  /**
   * Async state for the result of a create or update action on a configured addon.
   */
  createdUpdatedConfiguredAddon: AsyncStateModel<ConfiguredAddonResponseJsonApi | null>;

  /**
   * Async state for the result of a generic operation invocation (e.g., folder list, disconnect).
   */
  operationInvocation: AsyncStateModel<OperationInvocation | null>;

  /**
   * Async state for a folder selection operation invocation (e.g., choosing a root folder).
   */
  selectedFolderOperationInvocation: AsyncStateModel<OperationInvocation | null>;
}
