import { User } from '@core/services/user/user.entity';

export interface UserStateModel {
  currentUser: User | null;
}
