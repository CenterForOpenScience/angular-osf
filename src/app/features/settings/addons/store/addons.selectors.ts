import { Selector } from '@ngxs/store';
import { AddonsStateModel } from './addons.models';
import { Addon } from '@osf/features/settings/addons/entities/addons.entities';
import { AddonsState } from '@osf/features/settings/addons/store/addons.state';

export class AddonsSelectors {
  @Selector([AddonsState])
  static getStorageAddons(state: AddonsStateModel): Addon[] {
    return state.storageAddons;
  }

  @Selector([AddonsState])
  static getCitationAddons(state: AddonsStateModel): Addon[] {
    return state.citationAddons;
  }

  @Selector([AddonsState])
  static getAuthorizedStorageAddons(state: AddonsStateModel) {
    return state.authorizedStorageAddons;
  }

  @Selector([AddonsState])
  static getAuthorizedCitationAddons(state: AddonsStateModel) {
    return state.authorizedCitationAddons;
  }

  @Selector([AddonsState])
  static getAddonUserReference(state: AddonsStateModel) {
    return state.addonsUserReference;
  }

  @Selector([AddonsState])
  static getCreatedOrUpdatedStorageAddon(state: AddonsStateModel) {
    return state.createdUpdatedAuthorizedAddon;
  }
}
