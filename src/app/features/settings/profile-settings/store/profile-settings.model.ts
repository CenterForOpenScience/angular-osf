import { User } from '@osf/core/models';

import { Education, Employment, Social } from '../models';

export const PROFILE_SETTINGS_STATE_NAME = 'profileSettings';

export interface ProfileSettingsStateModel {
  employment: Employment[];
  education: Education[];
  social: Social;
  user: Partial<User>;
}

export type ProfileSettingsUpdate = Partial<Employment>[] | Partial<Education>[] | Partial<Social> | Partial<User>;

export const PROFILE_SETTINGS_INITIAL_STATE: ProfileSettingsStateModel = {
  employment: [],
  education: [],
  social: {} as Social,
  user: {
    id: '',
    fullName: '',
    email: '',
    givenName: '',
    familyName: '',
    middleNames: '',
    suffix: '',
  },
};
