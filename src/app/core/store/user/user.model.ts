import { AsyncStateModel } from '@osf/shared/models';

import { User, UserSettings } from '../../models';

export interface UserStateModel {
  currentUser: AsyncStateModel<User | null>;
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
    error: '',
  },
  activeFlags: [],
};
