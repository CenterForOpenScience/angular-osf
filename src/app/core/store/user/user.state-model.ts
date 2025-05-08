import { User, UserSettings } from '@core/services/user/user.models';

export interface UserStateModel {
  currentUser: User | null;
  currentUserSettings: UserSettings | null;
}
