import { Education } from './user/education.model';
import { Employment } from './user/employment.model';
import { SocialModel } from './user/social.model';
import { UserModel } from './user/user.model';

export type ProfileSettingsUpdate =
  | Partial<Employment>[]
  | Partial<Education>[]
  | Partial<SocialModel>
  | Partial<UserModel>;
