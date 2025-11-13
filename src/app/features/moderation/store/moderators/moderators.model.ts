import { AsyncStateWithTotalCount } from '@osf/shared/models/store/async-state-with-total-count.model';

import { ModeratorAddModel, ModeratorModel } from '../../models';

export interface ModeratorsStateModel {
  moderators: ModeratorsDataStateModel;
  users: AsyncStateWithTotalCount<ModeratorAddModel[]>;
}

interface ModeratorsDataStateModel extends AsyncStateWithTotalCount<ModeratorModel[]> {
  searchValue: string | null;
}

export const MODERATORS_STATE_DEFAULTS: ModeratorsStateModel = {
  moderators: {
    data: [],
    isLoading: false,
    error: null,
    searchValue: null,
    totalCount: 0,
  },
  users: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  },
};
