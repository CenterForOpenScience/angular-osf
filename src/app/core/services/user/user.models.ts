import { Education } from '@osf/features/settings/profile-settings/education/educations.entities';
import { Employment } from '@osf/features/settings/profile-settings/employment/employment.entities';
import { Social } from '@osf/features/settings/profile-settings/social/social.entities';

//Domain models
export interface User {
  id: string;
  fullName: string;
  givenName: string;
  familyName: string;
  email?: string;
  middleNames?: string;
  suffix?: string;
  education: Education[];
  employment: Employment[];
  social: Social;
  dateRegistered: Date;
  link?: string;
  iri?: string;
  socials?: {
    orcid?: string;
    github?: string;
    scholar?: string;
    twitter?: string;
    linkedIn?: string;
    impactStory?: string;
    researcherId?: string;
  };
}

export interface UserSettings {
  subscribeOsfGeneralEmail: boolean;
  subscribeOsfHelpEmail: boolean;
}

// API Request/Response Models
export interface UserGetResponse {
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
    date_registered: string;
  };
  relationships: Record<string, unknown>;
  links: {
    html: string;
    profile_image: string;
    iri: string;
  };
}

export interface UserSettingsGetResponse {
  id: string;
  type: "user_settings";
  attributes: {
    subscribe_osf_general_email: boolean;
    subscribe_osf_help_email: boolean;
  };
}

export interface UserSettingsUpdateRequest {
  data: {
    id: string;
    type: "user_settings";
    attributes: {
      subscribe_osf_general_email: boolean;
      subscribe_osf_help_email: boolean;
    };
  }
}
