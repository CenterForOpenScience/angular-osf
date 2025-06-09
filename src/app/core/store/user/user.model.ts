import { AsyncStateModel } from '@shared/models/store';

import { User, UserSettings } from '../../models';

export interface UserStateModel {
  currentUser: AsyncStateModel<User | null>;
  currentUserSettings: AsyncStateModel<UserSettings | null>;
}
