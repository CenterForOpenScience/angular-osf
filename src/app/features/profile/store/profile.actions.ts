import { UserModel } from '@osf/shared/models/user/user.models';

export class FetchUserProfile {
  static readonly type = '[Profile] Fetch User Profile';

  constructor(public userId: string) {}
}

export class SetUserProfile {
  static readonly type = '[Profile] Set User Profile';

  constructor(public userProfile: UserModel) {}
}
