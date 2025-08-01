import { Selector } from '@ngxs/store';

import { ModeratorAddModel } from '../../models';

import { ModeratorsStateModel } from './moderators.model';
import { ModeratorsState } from './moderators.state';

export class ModeratorsSelectors {
  @Selector([ModeratorsState])
  static getModerators(state: ModeratorsStateModel) {
    return state.moderators.data.filter((moderator) => {
      return state.moderators.searchValue
        ? moderator.fullName.toLowerCase().includes(state.moderators.searchValue.toLowerCase())
        : true;
    });
  }

  @Selector([ModeratorsState])
  static isModeratorsLoading(state: ModeratorsStateModel) {
    return state.moderators.isLoading || false;
  }

  @Selector([ModeratorsState])
  static isModeratorsError(state: ModeratorsStateModel) {
    return !!state.moderators.error?.length;
  }

  @Selector([ModeratorsState])
  static getUsers(state: ModeratorsStateModel): ModeratorAddModel[] {
    return state.users.data;
  }

  @Selector([ModeratorsState])
  static isUsersLoading(state: ModeratorsStateModel): boolean {
    return state.users.isLoading;
  }

  @Selector([ModeratorsState])
  static getUsersError(state: ModeratorsStateModel): string | null {
    return state.users.error;
  }

  @Selector([ModeratorsState])
  static getUsersTotalCount(state: ModeratorsStateModel): number {
    return state.users.totalCount;
  }
}
