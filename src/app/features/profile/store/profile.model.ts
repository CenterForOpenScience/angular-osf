import { AsyncStateModel, UserModel } from '@osf/shared/models';

export interface ProfileStateModel {
  userProfile: AsyncStateModel<UserModel | null>;
}

export const PROFILE_STATE_DEFAULTS: ProfileStateModel = {
  userProfile: {
    data: null,
    isLoading: false,
    error: null,
  },
};
