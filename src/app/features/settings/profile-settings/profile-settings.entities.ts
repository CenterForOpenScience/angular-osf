import { Employment } from '@osf/features/settings/profile-settings/employment/employment.entities';
import { Education } from '@osf/features/settings/profile-settings/education/educations.entities';
import { User } from '@core/services/user/user.entity';
import { Social } from '@osf/features/settings/profile-settings/social/social.entities';

export const PROFILE_SETTINGS_STATE_NAME = 'profileSettings';

export interface ProfileSettingsStateModel {
  employment: Employment[];
  education: Education[];
  social: Social;
  user: Partial<User>;
}

export type ProfileSettingsUpdate =
  | Partial<Employment>[]
  | Partial<Education>[]
  | Partial<Social>
  | Partial<User>;

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
