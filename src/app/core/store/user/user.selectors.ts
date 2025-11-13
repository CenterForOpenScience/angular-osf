import { Selector } from '@ngxs/store';

import { Education } from '@osf/shared/models/user/education.model';
import { Employment } from '@osf/shared/models/user/employment.model';
import { SocialModel } from '@osf/shared/models/user/social.model';
import { UserModel } from '@osf/shared/models/user/user.models';

import { UserStateModel } from './user.model';
import { UserState } from './user.state';

export class UserSelectors {
  @Selector([UserState])
  static getCurrentUser(state: UserStateModel): UserModel | null {
    return state.currentUser.data || localStorage.getItem('currentUser')
      ? JSON.parse(localStorage.getItem('currentUser')!)
      : null;
  }

  @Selector([UserState])
  static getCurrentUserLoading(state: UserStateModel): boolean {
    return state.currentUser.isLoading;
  }

  @Selector([UserState])
  static getShareIndexing(state: UserStateModel): boolean | undefined {
    return state.currentUser.data?.allowIndexing;
  }

  @Selector([UserState])
  static getUserNames(state: UserStateModel): Partial<UserModel> | null {
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
  static getSocialLinks(state: UserStateModel): SocialModel | undefined {
    return state.currentUser.data?.social;
  }

  @Selector([UserState])
  static getCanViewReviews(state: UserStateModel): boolean {
    return state.currentUser.data?.canViewReviews || false;
  }

  @Selector([UserState])
  static isAuthenticated(state: UserStateModel): boolean {
    return !!state.currentUser.data || !!localStorage.getItem('currentUser');
  }
}
