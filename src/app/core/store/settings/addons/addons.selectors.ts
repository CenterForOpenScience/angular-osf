import { Selector } from '@ngxs/store';
import { AddonsStateModel } from './addons.models';
import { Addon } from '@shared/entities/addons.entities';
import { AddonsState } from '@core/store/settings/addons/addons.state';

export class AddonsSelectors {
  @Selector([AddonsState])
  static getStorageAddons(state: AddonsStateModel): Addon[] {
    return state.storageAddons;
  }

  @Selector([AddonsState])
  static getCitationAddons(state: AddonsStateModel): Addon[] {
    return state.citationAddons;
  }
}
