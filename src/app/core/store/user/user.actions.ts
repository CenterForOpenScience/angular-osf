import { User } from '@core/services/user/user.entity';

export class GetCurrentUser {
  static readonly type = '[User] Get Current User';
}

export class SetCurrentUser {
  static readonly type = '[User] Set Current User';

  constructor(public user: User) {}
}
