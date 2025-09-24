import { ResponseDataJsonApi } from '../common';

import { Education } from './education.model';
import { Employment } from './employment.model';
import { SocialModel } from './social.model';

export type UserResponseJsonApi = ResponseDataJsonApi<UserDataJsonApi>;

export interface UserDataResponseJsonApi {
  meta: {
    active_flags: string[];
    current_user: {
      data: UserDataJsonApi | null;
    };
  };
}

export interface UserAcceptedTermsOfServiceJsonApi {
  accepted_terms_of_service: boolean;
}

export interface UserDataJsonApi {
  id: string;
  type: string;
  attributes: UserAttributesJsonApi;
  relationships: UserRelationshipsJsonApi;
  links: UserLinksJsonApi;
}

export interface UserAttributesJsonApi {
  accepted_terms_of_service: boolean;
  active: boolean;
  allow_indexing: boolean;
  can_view_reviews: boolean;
  date_registered: string;
  education: Education[];
  employment: Employment[];
  family_name: string;
  full_name: string;
  given_name: string;
  middle_names: string;
  suffix: string;
  locale: string;
  social: SocialModel;
  timezone: string;
}

interface UserLinksJsonApi {
  html: string;
  iri: string;
  profile_image: string;
  self: string;
}

interface UserRelationshipsJsonApi {
  default_region: DefaultRegionJsonApi;
}

interface DefaultRegionJsonApi {
  data: {
    id: string;
    type: 'regions';
  };
}
