import { Education, Employment, Social, User, UserSettings } from '@osf/shared/models';

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

export class UpdateProfileSettingsEmployment {
  static readonly type = '[Profile Settings] Update Employment';

  constructor(public payload: Employment[]) {}
}

export class UpdateProfileSettingsEducation {
  static readonly type = '[Profile Settings] Update Education';

  constructor(public payload: Education[]) {}
}

export class UpdateProfileSettingsSocialLinks {
  static readonly type = '[Profile Settings] Update Social Links';

  constructor(public payload: Partial<Social>[]) {}
}

export class UpdateProfileSettingsUser {
  static readonly type = '[Profile Settings] Update User';

  constructor(public payload: Partial<User>) {}
}

export class SetUserAsModerator {
  static readonly type = '[User] Set User As Moderator';
}

export class AcceptTermsOfServiceByUser {
  static readonly type = '[User] Accept Terms Of Service';
}

export class ClearCurrentUser {
  static readonly type = '[User] Clear Current User';
}
