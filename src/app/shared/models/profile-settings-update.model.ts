import { Education, Employment, SocialModel, User } from './user';

export type ProfileSettingsUpdate = Partial<Employment>[] | Partial<Education>[] | Partial<SocialModel> | Partial<User>;
