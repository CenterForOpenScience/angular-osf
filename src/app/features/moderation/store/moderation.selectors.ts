import { Selector } from '@ngxs/store';

import { ModeratorAddModel } from '../models';

import { ModerationStateModel } from './moderation.model';
import { ModerationState } from './moderation.state';

export class ModerationSelectors {
  @Selector([ModerationState])
  static getCollectionModerators(state: ModerationStateModel) {
    return state.collectionModerators.data.filter((moderator) => {
      return state.collectionModerators.searchValue
        ? moderator.fullName.toLowerCase().includes(state.collectionModerators.searchValue.toLowerCase())
        : true;
    });
  }

  @Selector([ModerationState])
  static isModeratorsLoading(state: ModerationStateModel) {
    return state.collectionModerators.isLoading || false;
  }

  @Selector([ModerationState])
  static isModeratorsError(state: ModerationStateModel) {
    return !!state.collectionModerators.error?.length;
  }

  @Selector([ModerationState])
  static getUsers(state: ModerationStateModel): ModeratorAddModel[] {
    return state.users.data;
  }

  @Selector([ModerationState])
  static isUsersLoading(state: ModerationStateModel): boolean {
    return state.users.isLoading;
  }

  @Selector([ModerationState])
  static getUsersError(state: ModerationStateModel): string | null {
    return state.users.error;
  }

  @Selector([ModerationState])
  static getUsersTotalCount(state: ModerationStateModel): number {
    return state.users.totalCount;
  }
}
