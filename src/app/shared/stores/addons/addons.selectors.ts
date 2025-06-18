import { Selector } from '@ngxs/store';

import {
  Addon,
  AuthorizedAddon,
  AuthorizedAddonResponseJsonApi,
  ConfiguredAddon,
  ConfiguredAddonResponseJsonApi,
  OperationInvocation,
  ResourceReferenceJsonApi,
  StorageItem,
  UserReferenceJsonApi,
} from '@shared/models';

import { AddonsStateModel } from './addons.models';
import { AddonsState } from './addons.state';

export class AddonsSelectors {
  @Selector([AddonsState])
  static getStorageAddons(state: AddonsStateModel): Addon[] {
    return state.storageAddons.data;
  }

  @Selector([AddonsState])
  static getStorageAddonsLoading(state: AddonsStateModel): boolean {
    return state.storageAddons.isLoading;
  }

  @Selector([AddonsState])
  static getCitationAddons(state: AddonsStateModel): Addon[] {
    return state.citationAddons.data;
  }

  @Selector([AddonsState])
  static getCitationAddonsLoading(state: AddonsStateModel): boolean {
    return state.citationAddons.isLoading;
  }

  @Selector([AddonsState])
  static getAuthorizedStorageAddons(state: AddonsStateModel): AuthorizedAddon[] {
    return state.authorizedStorageAddons.data;
  }

  @Selector([AddonsState])
  static getAuthorizedStorageAddonsLoading(state: AddonsStateModel): boolean {
    return state.authorizedStorageAddons.isLoading;
  }

  @Selector([AddonsState])
  static getAuthorizedCitationAddons(state: AddonsStateModel): AuthorizedAddon[] {
    return state.authorizedCitationAddons.data;
  }

  @Selector([AddonsState])
  static getAuthorizedCitationAddonsLoading(state: AddonsStateModel): boolean {
    return state.authorizedCitationAddons.isLoading;
  }

  @Selector([AddonsState])
  static getConfiguredStorageAddons(state: AddonsStateModel): ConfiguredAddon[] {
    return state.configuredStorageAddons.data;
  }

  @Selector([AddonsState])
  static getConfiguredStorageAddonsLoading(state: AddonsStateModel): boolean {
    return state.configuredStorageAddons.isLoading;
  }

  @Selector([AddonsState])
  static getConfiguredCitationAddons(state: AddonsStateModel): ConfiguredAddon[] {
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
