import { AsyncStateModel } from '@osf/shared/models';

import { ModeratorAddModel, ModeratorModel } from '../models';

interface ModerationDataStateModel extends AsyncStateModel<ModeratorModel[]> {
  searchValue: string | null;
}

interface UsersDataStateModel extends AsyncStateModel<ModeratorAddModel[]> {
  totalCount: number;
}

export interface ModerationStateModel {
  collectionModerators: ModerationDataStateModel;
  users: UsersDataStateModel;
}
