import { Selector } from '@ngxs/store';

import { User } from '@osf/core/models';
import { Education, Employment, Social } from '@osf/shared/models';

import { ProfileSettingsStateModel } from './profile-settings.model';
import { ProfileSettingsState } from './profile-settings.state';

export class ProfileSettingsSelectors {
  @Selector([ProfileSettingsState])
  static educations(state: ProfileSettingsStateModel): Education[] {
    return state.education;
  }

  @Selector([ProfileSettingsState])
  static employment(state: ProfileSettingsStateModel): Employment[] {
    return state.employment;
  }

  @Selector([ProfileSettingsState])
  static socialLinks(state: ProfileSettingsStateModel): Social {
    return state.social;
  }

  @Selector([ProfileSettingsState])
  static user(state: ProfileSettingsStateModel): Partial<User> {
    return state.user;
  }
}
