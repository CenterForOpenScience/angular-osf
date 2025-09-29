import { Selector } from '@ngxs/store';

import { UserModel } from '@osf/shared/models';

import { ProfileStateModel } from './profile.model';
import { ProfileState } from '.';

export class ProfileSelectors {
  @Selector([ProfileState])
  static getUserProfile(state: ProfileStateModel): UserModel | null {
    return state.userProfile.data;
  }

  @Selector([ProfileState])
  static isUserProfileLoading(state: ProfileStateModel): boolean {
    return state.userProfile.isLoading;
  }
}
