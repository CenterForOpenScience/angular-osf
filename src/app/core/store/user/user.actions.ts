import { Education } from '@osf/shared/models/user/education.model';
import { Employment } from '@osf/shared/models/user/employment.model';
import { SocialModel } from '@osf/shared/models/user/social.model';
import { UserModel } from '@osf/shared/models/user/user.models';

export class GetCurrentUser {
  static readonly type = '[User] Get Current User';
}

export class SetCurrentUser {
  static readonly type = '[User] Set Current User';
  constructor(public user: UserModel) {}
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

  constructor(public payload: Partial<SocialModel>[]) {}
}

export class UpdateProfileSettingsUser {
  static readonly type = '[Profile Settings] Update User';

  constructor(public payload: Partial<UserModel>) {}
}

export class AcceptTermsOfServiceByUser {
  static readonly type = '[User] Accept Terms Of Service';
}

export class ClearCurrentUser {
  static readonly type = '[User] Clear Current User';
}
