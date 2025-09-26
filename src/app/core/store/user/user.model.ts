import { AsyncStateModel, UserModel } from '@osf/shared/models';

export interface UserStateModel {
  currentUser: AsyncStateModel<UserModel | null>;
  activeFlags: string[];
}

export const USER_STATE_INITIAL: UserStateModel = {
  currentUser: {
    data: null,
    isLoading: false,
    error: null,
  },
  activeFlags: [],
};
