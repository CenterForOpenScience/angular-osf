import { Education, Employment, SocialModel, UserModel } from './user';

export type ProfileSettingsUpdate =
  | Partial<Employment>[]
  | Partial<Education>[]
  | Partial<SocialModel>
  | Partial<UserModel>;
