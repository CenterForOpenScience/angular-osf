import { createSelector, Selector } from '@ngxs/store';

import {
  AddonModel,
  AuthorizedAccountModel,
  AuthorizedAddonResponseJsonApi,
  ConfiguredAddonResponseJsonApi,
  ConfiguredStorageAddonModel,
  OperationInvocation,
  ResourceReferenceJsonApi,
  StorageItem,
  UserReferenceJsonApi,
} from '@shared/models';

import { AddonsStateModel } from './addons.models';
import { AddonsState } from './addons.state';

/**
 * A static utility class containing NGXS selectors for accessing various slices
 * of the `AddonsStateModel` in the NGXS store.
 *
 * This class provides typed, reusable selectors to extract addon-related state such as
 * storage, citation, authorized, and configured addon collections. It supports structured
 * access to application state and encourages consistency across components.
 *
 * All selectors in this class operate on the `AddonsStateModel`.
 */
export class AddonsSelectors {
  /**
   * Selector to retrieve the list of available external storage addons from the NGXS state.
   *
   * These are public addon services (e.g., Google Drive, Dropbox) available for configuration.
   * The data is retrieved from the `storageAddons` portion of the `AddonsStateModel`.
   *
   * @param state - The current `AddonsStateModel` from the NGXS store.
   * @returns An array of available `Addon` objects representing storage providers.
   */
  @Selector([AddonsState])
  static getStorageAddons(state: AddonsStateModel): AddonModel[] {
    return state.storageAddons.data;
  }

  /**
   * Selector to retrieve a specific storage addon by its ID from the NGXS state.
   *
   * @param state The current state of the Addons NGXS store.
   * @param id The unique identifier of the storage addon to retrieve.
   * @returns The matched Addon object if found, otherwise undefined.
   */
  static getStorageAddon(id: string): (state: AddonsStateModel) => AddonModel | null {
    return createSelector([AddonsState], (state: AddonsStateModel): AddonModel | null => {
      return state.storageAddons.data.find((addon: AddonModel) => addon.id === id) || null;
    });
  }
  /**
   * Selector to retrieve the loading status of storage addons from the AddonsState.
   *
   * @param state The current state of the Addons feature.
   * @returns A boolean indicating whether storage addons are currently being loaded.
   */
  @Selector([AddonsState])
  static getStorageAddonsLoading(state: AddonsStateModel): boolean {
    return state.storageAddons.isLoading;
  }

  @Selector([AddonsState])
  static getCitationAddons(state: AddonsStateModel): AddonModel[] {
    return state.citationAddons.data;
  }

  @Selector([AddonsState])
  static getCitationAddonsLoading(state: AddonsStateModel): boolean {
    return state.citationAddons.isLoading;
  }

  @Selector([AddonsState])
  static getAuthorizedStorageAddons(state: AddonsStateModel): AuthorizedAccountModel[] {
    return state.authorizedStorageAddons.data;
  }

  static getAuthorizedStorageAddonOauthToken(id: string): (state: AddonsStateModel) => string | null {
    return createSelector([AddonsState], (state: AddonsStateModel): string | null => {
      return (
        state.authorizedStorageAddons.data.find((addon: AuthorizedAccountModel) => addon.id === id)?.oauthToken || null
      );
    });
  }

  @Selector([AddonsState])
  static getAuthorizedStorageAddonsLoading(state: AddonsStateModel): boolean {
    return state.authorizedStorageAddons.isLoading;
  }

  @Selector([AddonsState])
  static getAuthorizedCitationAddons(state: AddonsStateModel): AuthorizedAccountModel[] {
    return state.authorizedCitationAddons.data;
  }

  @Selector([AddonsState])
  static getAuthorizedCitationAddonsLoading(state: AddonsStateModel): boolean {
    return state.authorizedCitationAddons.isLoading;
  }

  /**
   * Selector to retrieve the list of configured storage addons from the NGXS state.
   *
   * @param state - The current state of the AddonsStateModel.
   * @returns An array of configured storage addons.
   *
   * @example
   * const addons = this.store.selectSnapshot(AddonsSelectors.getConfiguredStorageAddons);
   */
  @Selector([AddonsState])
  static getConfiguredStorageAddons(state: AddonsStateModel): ConfiguredStorageAddonModel[] {
    return state.configuredStorageAddons.data;
  }

  /**
   * Selector to determine whether the configured storage addons are currently being loaded.
   *
   * @param state - The current state of the AddonsStateModel.
   * @returns A boolean indicating if the addons are loading.
   *
   * @example
   * const isLoading = this.store.selectSnapshot(AddonsSelectors.getConfiguredStorageAddonsLoading);
   */
  @Selector([AddonsState])
  static getConfiguredStorageAddonsLoading(state: AddonsStateModel): boolean {
    return state.configuredStorageAddons.isLoading;
  }

  @Selector([AddonsState])
  static getConfiguredCitationAddons(state: AddonsStateModel): ConfiguredStorageAddonModel[] {
    return state.configuredCitationAddons.data;
  }

  @Selector([AddonsState])
  static getConfiguredCitationAddonsLoading(state: AddonsStateModel): boolean {
    return state.configuredCitationAddons.isLoading;
  }

  @Selector([AddonsState])
  static getAddonsUserReference(state: AddonsStateModel): UserReferenceJsonApi[] {
    return state.addonsUserReference.data;
  }

  @Selector([AddonsState])
  static getAddonsUserReferenceLoading(state: AddonsStateModel): boolean {
    return state.addonsUserReference.isLoading;
  }

  @Selector([AddonsState])
  static getAddonsResourceReference(state: AddonsStateModel): ResourceReferenceJsonApi[] {
    return state.addonsResourceReference.data;
  }

  @Selector([AddonsState])
  static getAddonsResourceReferenceLoading(state: AddonsStateModel): boolean {
    return state.addonsResourceReference.isLoading;
  }

  @Selector([AddonsState])
  static getCreatedOrUpdatedAuthorizedAddon(state: AddonsStateModel): AuthorizedAddonResponseJsonApi | null {
    return state.createdUpdatedAuthorizedAddon.data;
  }

  @Selector([AddonsState])
  static getCreatedOrUpdatedStorageAddonSubmitting(state: AddonsStateModel): boolean {
    return state.createdUpdatedAuthorizedAddon.isSubmitting || false;
  }

  @Selector([AddonsState])
  static getCreatedOrUpdatedConfiguredAddon(state: AddonsStateModel): ConfiguredAddonResponseJsonApi | null {
    return state.createdUpdatedConfiguredAddon.data;
  }

  @Selector([AddonsState])
  static getCreatedOrUpdatedConfiguredAddonSubmitting(state: AddonsStateModel): boolean {
    return state.createdUpdatedConfiguredAddon.isSubmitting || false;
  }

  @Selector([AddonsState])
  static getOperationInvocation(state: AddonsStateModel): OperationInvocation | null {
    return state.operationInvocation.data;
  }

  @Selector([AddonsState])
  static getOperationInvocationSubmitting(state: AddonsStateModel): boolean {
    return state.operationInvocation.isSubmitting || false;
  }

  @Selector([AddonsState])
  static getSelectedFolderOperationInvocation(state: AddonsStateModel): OperationInvocation | null {
    return state.selectedFolderOperationInvocation.data;
  }

  @Selector([AddonsState])
  static getSelectedFolder(state: AddonsStateModel): StorageItem | null {
    return state.selectedFolderOperationInvocation.data?.operationResult[0] || null;
  }

  @Selector([AddonsState])
  static getDeleteStorageAddonSubmitting(state: AddonsStateModel): boolean {
    return state.createdUpdatedConfiguredAddon.isSubmitting || false;
  }
}
