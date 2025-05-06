import { Employment } from '@osf/features/settings/profile-settings/employment/employment.entities';
import { Education } from '@osf/features/settings/profile-settings/education/educations.entities';
import { Social } from '@osf/features/settings/profile-settings/social/social.entities';

export interface UserUS {
  id: string;
  type: string;
  attributes: {
    full_name: string;
    given_name: string;
    family_name: string;
    email?: string;
    employment: Employment[];
    education: Education[];
    middle_names?: string;
    suffix?: string;
    social: Social;
  };
  relationships: Record<string, unknown>;
  links: Record<string, string>;
}
