export interface ReviewActionJsonApi {
  id: string;
  type: 'review-actions';
  attributes: ReviewActionAttributesJsonApi;
  embeds: {
    creator: {
      data: UserModelJsonApi;
    };
    target: {
      data: PreprintModelJsonApi;
    };
  };
}

export interface ReviewActionAttributesJsonApi {
  trigger: string;
  comment: string;
  from_state: string;
  to_state: string;
  date_created: string;
  date_modified: string;
  auto: boolean;
}

export interface UserModelJsonApi {
  id: string;
  type: 'users';
  attributes: UserAttributesJsonApi;
}

export interface UserAttributesJsonApi {
  full_name: string;
  given_name: string;
  middle_names: string;
  family_name: string;
  suffix: string;
  date_registered: string;
  active: boolean;
  timezone: string;
  locale: string;
}

export interface PreprintModelJsonApi {
  id: string;
  type: 'preprints';
  attributes: PreprintAttributesJsonApi;
}

export interface PreprintAttributesJsonApi {
  date_created: string;
  date_modified: string;
  date_published: string | null;
  original_publication_date: string | null;
  custom_publication_citation: string | null;
  doi: string | null;
  title: string;
  description: string;
  is_published: boolean | null;
  is_preprint_orphan: boolean | null;
  tags: string[];
  preprint_doi_created: string | null;
  date_withdrawn: string;
  withdrawal_justification: string;
  current_user_permissions: string[];
  public: boolean;
  reviews_state: string;
  date_last_transitioned: string | null;
  version: number;
  is_latest_version: boolean;
  has_coi: boolean;
  conflict_of_interest_statement: string;
  has_data_links: 'not_applicable' | 'available' | 'unavailable';
  why_no_data: string | null;
  has_prereg_links: 'not_applicable' | 'available' | 'unavailable';
  why_no_prereg: string | null;
  prereg_link_info: string | null;
}
