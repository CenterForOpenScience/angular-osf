import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';
import { UserModel } from '@osf/shared/models/user/user.models';

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
