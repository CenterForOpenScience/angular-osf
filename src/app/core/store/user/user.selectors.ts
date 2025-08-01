import { Selector } from '@ngxs/store';

import { User, UserSettings } from '@osf/core/models';
import { Education, Employment, Social } from '@osf/shared/models';

import { UserStateModel } from './user.model';
import { UserState } from './user.state';

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

  @Selector([UserState])
  static getShareIndexing(state: UserStateModel): boolean | undefined {
    return state.currentUser.data?.allowIndexing;
  }

  @Selector([UserState])
  static getUserNames(state: UserStateModel): Partial<User> | null {
    return state.currentUser.data;
  }

  @Selector([UserState])
  static getEmployment(state: UserStateModel): Employment[] {
    return state.currentUser.data?.employment || [];
  }

  @Selector([UserState])
  static getEducation(state: UserStateModel): Education[] {
    return state.currentUser.data?.education || [];
  }

  @Selector([UserState])
  static getSocialLinks(state: UserStateModel): Social | undefined {
    return state.currentUser.data?.social;
  }
}
