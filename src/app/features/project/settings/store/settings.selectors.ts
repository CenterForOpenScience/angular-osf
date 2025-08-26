import { Selector } from '@ngxs/store';

import { NotificationSubscription } from '@osf/shared/models';

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

  @Selector([SettingsState])
  static areProjectDetailsLoading(state: SettingsStateModel) {
    return state.projectDetails.isLoading;
  }

  @Selector([SettingsState])
  static getNotificationSubscriptions(state: SettingsStateModel): NotificationSubscription[] {
    return state.notifications.data;
  }

  @Selector([SettingsState])
  static areNotificationsLoading(state: SettingsStateModel): boolean {
    return state.notifications.isLoading;
  }
}
