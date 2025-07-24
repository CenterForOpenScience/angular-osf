import { User } from '@osf/core/models';
import { Education, Employment, Social } from '@osf/shared/models';

export type ProfileSettingsUpdate = Partial<Employment>[] | Partial<Education>[] | Partial<Social> | Partial<User>;
