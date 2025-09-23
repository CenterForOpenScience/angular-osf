import { AsyncStateModel, UserModel, UserSettings } from '@osf/shared/models';

export interface UserStateModel {
  currentUser: AsyncStateModel<UserModel | null>;
  currentUserSettings: AsyncStateModel<UserSettings | null>;
  activeFlags: string[];
}

export const USER_STATE_INITIAL: UserStateModel = {
  currentUser: {
    data: null,
    isLoading: false,
    error: null,
  },
  currentUserSettings: {
    data: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  activeFlags: [],
};
