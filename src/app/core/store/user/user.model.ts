import { AsyncStateModel } from '@shared/models/store';

import { User, UserSettings } from '../../models';

export interface UserStateModel {
  currentUser: User | null;
  currentUserSettings: AsyncStateModel<UserSettings | null>;
}
