import { AsyncStateModel, User } from '@osf/shared/models';

export interface ProfileStateModel {
  userProfile: AsyncStateModel<User | null>;
}

export const PROFILE_STATE_DEFAULTS: ProfileStateModel = {
  userProfile: {
    data: null,
    isLoading: false,
    error: null,
  },
};
