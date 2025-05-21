import { Selector } from '@ngxs/store';

import { User, UserSettings } from '@core/services/user';
import { UserState, UserStateModel } from '@core/store/user';
import { ProfileSettingsStateModel } from '@osf/features/settings/profile-settings/profile-settings.entities';
import { Social } from '@osf/features/settings/profile-settings/social/social.entities';

export class UserSelectors {
  @Selector([UserState])
  static getCurrentUser(state: UserStateModel): User | null {
    return state.currentUser;
  }

  @Selector([UserState])
  static getProfileSettings(state: UserStateModel): ProfileSettingsStateModel {
    return {
      education: state.currentUser?.education ?? [],
      employment: state.currentUser?.employment ?? [],
      social: state.currentUser?.social ?? ({} as Social),
      user: {
        middleNames: state.currentUser?.middleNames ?? '',
        suffix: state.currentUser?.suffix ?? '',
        id: state.currentUser?.id ?? '',
        fullName: state.currentUser?.fullName ?? '',
        email: state.currentUser?.email ?? '',
        givenName: state.currentUser?.givenName ?? '',
        familyName: state.currentUser?.familyName ?? '',
      },
    } satisfies ProfileSettingsStateModel;
  }

  @Selector([UserState])
  static getCurrentUserSettings(state: UserStateModel): UserSettings | null {
    return state.currentUserSettings.data;
  }

  @Selector([UserState])
  static isUserSettingsLoading(state: UserStateModel): boolean {
    return state.currentUserSettings.isLoading;
  }

  @Selector([UserState])
  static isUserSettingsSubmitting(state: UserStateModel): boolean {
    return state.currentUserSettings.isSubmitting!;
  }
}
