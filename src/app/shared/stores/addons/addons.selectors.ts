import { createSelector, Selector } from '@ngxs/store';

import { AddonModel } from '@osf/shared/models/addons/addon.model';
import {
  ConfiguredAddonResponseJsonApi,
  ResourceReferenceJsonApi,
  UserReferenceJsonApi,
} from '@osf/shared/models/addons/addon-json-api.models';
import { AuthorizedAccountModel } from '@osf/shared/models/addons/authorized-account.model';
import { ConfiguredAddonModel } from '@osf/shared/models/addons/configured-addon.model';
import { OperationInvocation } from '@osf/shared/models/addons/operation-invocation.model';
import { StorageItem } from '@osf/shared/models/addons/storage-item.model';

import { AddonsStateModel } from './addons.models';
import { AddonsState } from './addons.state';

export class AddonsSelectors {
  @Selector([AddonsState])
  static getStorageAddons(state: AddonsStateModel): AddonModel[] {
    return state.storageAddons.data;
  }

  static getStorageAddon(id: string): (state: AddonsStateModel) => AddonModel | null {
    return createSelector([AddonsState], (state: AddonsStateModel): AddonModel | null => {
      return state.storageAddons.data.find((addon: AddonModel) => addon.id === id) || null;
    });
  }

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
  static getLinkAddons(state: AddonsStateModel): AddonModel[] {
    return state.linkAddons.data;
  }

  @Selector([AddonsState])
  static getLinkAddonsLoading(state: AddonsStateModel): boolean {
    return state.linkAddons.isLoading;
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

  @Selector([AddonsState])
  static getAuthorizedLinkAddons(state: AddonsStateModel): AuthorizedAccountModel[] {
    return state.authorizedLinkAddons.data;
  }

  @Selector([AddonsState])
  static getAuthorizedLinkAddonsLoading(state: AddonsStateModel): boolean {
    return state.authorizedLinkAddons.isLoading;
  }

  @Selector([AddonsState])
  static getConfiguredStorageAddons(state: AddonsStateModel): ConfiguredAddonModel[] {
    return state.configuredStorageAddons.data;
  }

  @Selector([AddonsState])
  static getConfiguredStorageAddonsLoading(state: AddonsStateModel): boolean {
    return state.configuredStorageAddons.isLoading;
  }

  @Selector([AddonsState])
  static getConfiguredCitationAddons(state: AddonsStateModel): ConfiguredAddonModel[] {
    return state.configuredCitationAddons.data;
  }

  @Selector([AddonsState])
  static getConfiguredCitationAddonsLoading(state: AddonsStateModel): boolean {
    return state.configuredCitationAddons.isLoading;
  }

  @Selector([AddonsState])
  static getConfiguredLinkAddons(state: AddonsStateModel): ConfiguredAddonModel[] {
    return state.configuredLinkAddons.data;
  }

  @Selector([AddonsState])
  static getConfiguredLinkAddonsLoading(state: AddonsStateModel): boolean {
    return state.configuredLinkAddons.isLoading;
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
  static getCreatedOrUpdatedAuthorizedAddon(state: AddonsStateModel): AuthorizedAccountModel | null {
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
    return state.selectedItemOperationInvocation.data;
  }

  @Selector([AddonsState])
  static getSelectedStorageItem(state: AddonsStateModel): StorageItem | null {
    return state.selectedItemOperationInvocation.data?.operationResult[0] || null;
  }

  @Selector([AddonsState])
  static getDeleteStorageAddonSubmitting(state: AddonsStateModel): boolean {
    return state.createdUpdatedConfiguredAddon.isSubmitting || false;
  }

  @Selector([AddonsState])
  static getAllCitationOperationInvocations(state: AddonsStateModel): AddonsStateModel['citationOperationInvocations'] {
    return state.citationOperationInvocations || {};
  }

  @Selector([AddonsState])
  static getCitationOperationInvocation(addonId: string): (state: AddonsStateModel) => OperationInvocation | null {
    return createSelector([AddonsState], (state: AddonsStateModel): OperationInvocation | null => {
      return state.citationOperationInvocations?.[addonId]?.data || null;
    });
  }

  @Selector([AddonsState])
  static getCitationOperationInvocationSubmitting(addonId: string): (state: AddonsStateModel) => boolean {
    return createSelector([AddonsState], (state: AddonsStateModel): boolean => {
      return state.citationOperationInvocations?.[addonId]?.isSubmitting || false;
    });
  }
}
