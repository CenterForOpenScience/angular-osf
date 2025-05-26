import { User, UserSettings } from '../../models';

export class GetCurrentUser {
  static readonly type = '[User] Get Current User';
}

export class SetCurrentUser {
  static readonly type = '[User] Set Current User';

  constructor(public user: User) {}
}

export class GetCurrentUserSettings {
  static readonly type = '[User] Get Current User Settings';
}

export class UpdateUserSettings {
  static readonly type = '[User] Update User Settings';

  constructor(
    public userId: string,
    public updatedUserSettings: UserSettings
  ) {}
}
