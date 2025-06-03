import { User } from '@osf/core/models';
import { Education, Employment, Social } from '@osf/shared/models';

export class SetupProfileSettings {
  static readonly type = '[Profile Settings] Setup Profile Settings';
}

export class UpdateProfileSettingsEmployment {
  static readonly type = '[Profile Settings] Update Employment';

  constructor(public payload: { employment: Employment[] }) {}
}

export class UpdateProfileSettingsEducation {
  static readonly type = '[Profile Settings] Update Education';

  constructor(public payload: { education: Education[] }) {}
}

export class UpdateProfileSettingsSocialLinks {
  static readonly type = '[Profile Settings] Update Social Links';

  constructor(public payload: { socialLinks: Partial<Social>[] }) {}
}

export class UpdateProfileSettingsUser {
  static readonly type = '[Profile Settings] Update User';

  constructor(public payload: { user: Partial<User> }) {}
}
