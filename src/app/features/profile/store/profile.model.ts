import { AsyncStateModel, User } from '@osf/shared/models';
import { searchStateDefaults } from '@shared/constants';
import { BaseSearchStateModel } from '@shared/stores';

export interface ProfileStateModel extends BaseSearchStateModel {
  userProfile: AsyncStateModel<User | null>;
}

export const PROFILE_STATE_DEFAULTS: ProfileStateModel = {
  userProfile: {
    data: null,
    isLoading: false,
    error: null,
  },
  ...searchStateDefaults,
};
