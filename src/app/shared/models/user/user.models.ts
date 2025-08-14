import { Education, Employment, Social } from '@osf/shared/models';

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
  defaultRegionId: string;
  allowIndexing: boolean | undefined;
  isModerator?: boolean;
}

export interface UserSettings {
  subscribeOsfGeneralEmail: boolean;
  subscribeOsfHelpEmail: boolean;
}

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
    allow_indexing?: boolean;
  };
  relationships: {
    default_region: {
      data: {
        id: string;
      };
    };
  };
  links: {
    html: string;
    profile_image: string;
    iri: string;
  };
}

export interface UserSettingsGetResponse {
  id: string;
  type: 'user_settings';
  attributes: {
    subscribe_osf_general_email: boolean;
    subscribe_osf_help_email: boolean;
  };
}

export interface UserSettingsUpdateRequest {
  data: {
    id: string;
    type: 'user_settings';
    attributes: {
      subscribe_osf_general_email: boolean;
      subscribe_osf_help_email: boolean;
    };
  };
}

export interface UserNamesJsonApi {
  full_name: string;
  given_name: string;
  family_name: string;
  middle_names: string;
  suffix: string;
}

export interface UserDataResponseJsonApi {
  meta: {
    active_flags: string[];
    current_user: {
      data: UserGetResponse | null;
    };
  };
}

export interface UserData {
  activeFlags: string[];
  currentUser: User | null;
}
