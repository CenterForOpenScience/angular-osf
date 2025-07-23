import { AsyncStateModel } from '@osf/shared/models';

import { ModeratorAddModel, ModeratorModel } from '../../models';

interface ModeratorsDataStateModel extends AsyncStateModel<ModeratorModel[]> {
  searchValue: string | null;
}

interface UsersDataStateModel extends AsyncStateModel<ModeratorAddModel[]> {
  totalCount: number;
}

export interface ModeratorsStateModel {
  moderators: ModeratorsDataStateModel;
  users: UsersDataStateModel;
}

export const MODERATORS_STATE_DEFAULTS = {
  moderators: {
    data: [],
    isLoading: false,
    error: null,
    searchValue: null,
  },
  users: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
};
