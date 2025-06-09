import { Selector } from '@ngxs/store';

import { UserState, UserStateModel } from '@core/store/user';
import { User, UserSettings } from '@osf/core/models';
import { ProfileSettingsStateModel } from '@osf/features/settings/profile-settings/store';
import { Social } from '@osf/shared/models';

export class UserSelectors {
  @Selector([UserState])
  static getCurrentUser(state: UserStateModel): User | null {
    return state.currentUser.data;
  }

  @Selector([UserState])
  static getCurrentUserLoading(state: UserStateModel): boolean {
    return state.currentUser.isLoading;
  }

  @Selector([UserState])
  static getProfileSettings(state: UserStateModel): ProfileSettingsStateModel {
    return {
      education: state.currentUser.data?.education ?? [],
      employment: state.currentUser.data?.employment ?? [],
      social: state.currentUser.data?.social ?? ({} as Social),
      user: {
        middleNames: state.currentUser.data?.middleNames ?? '',
        suffix: state.currentUser.data?.suffix ?? '',
        id: state.currentUser.data?.id ?? '',
        fullName: state.currentUser.data?.fullName ?? '',
        email: state.currentUser.data?.email ?? '',
        givenName: state.currentUser.data?.givenName ?? '',
        familyName: state.currentUser.data?.familyName ?? '',
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
