import { Selector } from '@ngxs/store';

import { SettingsStateModel } from './settings.model';
import { SettingsState } from './settings.state';

export class SettingsSelectors {
  @Selector([SettingsState])
  static getSettings(state: SettingsStateModel) {
    return state.settings.data;
  }

  @Selector([SettingsState])
  static getProjectDetails(state: SettingsStateModel) {
    return state.projectDetails.data;
  }
}
