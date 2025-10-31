import { AsyncStateModel } from '@osf/shared/models/store/async-state.model';
import { UserModel } from '@osf/shared/models/user/user.models';

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
