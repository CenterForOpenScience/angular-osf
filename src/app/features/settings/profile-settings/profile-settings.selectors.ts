import { Selector } from '@ngxs/store';

import { User } from '@core/services/user/user.entity';
import { Education } from '@osf/features/settings/profile-settings/education/educations.entities';
import { Employment } from '@osf/features/settings/profile-settings/employment/employment.entities';
import { ProfileSettingsStateModel } from '@osf/features/settings/profile-settings/profile-settings.entities';
import { ProfileSettingsState } from '@osf/features/settings/profile-settings/profile-settings.state';
import { Social } from '@osf/features/settings/profile-settings/social/social.entities';

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
