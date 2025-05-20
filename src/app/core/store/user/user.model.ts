import { User, UserSettings } from '@core/services/user/user.models';
import { AsyncStateModel } from '@shared/models/store';

export interface UserStateModel {
  currentUser: User | null;
  currentUserSettings: AsyncStateModel<UserSettings | null>;
}
