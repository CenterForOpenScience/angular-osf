import { Education, Employment, Social, User } from './user';

export type ProfileSettingsUpdate = Partial<Employment>[] | Partial<Education>[] | Partial<Social> | Partial<User>;
