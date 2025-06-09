import { Selector } from '@ngxs/store';

import {
  Addon,
  AddonResponse,
  AuthorizedAddon,
  ConfiguredAddon,
  ResourceReference,
  UserReference,
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
  static getAddonsUserReference(state: AddonsStateModel): UserReference[] {
    return state.addonsUserReference.data;
  }

  @Selector([AddonsState])
  static getAddonsUserReferenceLoading(state: AddonsStateModel): boolean {
    return state.addonsUserReference.isLoading;
  }

  @Selector([AddonsState])
  static getAddonsResourceReference(state: AddonsStateModel): ResourceReference[] {
    return state.addonsResourceReference.data;
  }

  @Selector([AddonsState])
  static getAddonsResourceReferenceLoading(state: AddonsStateModel): boolean {
    return state.addonsResourceReference.isLoading;
  }

  @Selector([AddonsState])
  static getCreatedOrUpdatedAuthorizedAddon(state: AddonsStateModel): AddonResponse | null {
    return state.createdUpdatedAuthorizedAddon.data;
  }

  @Selector([AddonsState])
  static getCreatedOrUpdatedStorageAddonSubmitting(state: AddonsStateModel): boolean {
    return state.createdUpdatedAuthorizedAddon.isSubmitting || false;
  }
}
