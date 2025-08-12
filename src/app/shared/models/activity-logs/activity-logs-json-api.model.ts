export interface ActivityLogJsonApi {
  id: string;
  type: string;
  attributes: {
    action: string;
    date: string;
    params: {
      contributors: unknown[];
      license?: string;
      tag?: string;
      institution?: {
        id: string;
        name: string;
      };
      params_node: {
        id: string;
        title: string;
      };
      params_project: null;
      pointer: PointerJsonApi | null;
      preprint_provider: string | null;
    };
  };
  embeds?: {
    original_node?: {
      data: OriginalNodeEmbedsData;
    };
    user?: {
      data: UserEmbedsData;
    };
    linked_node?: {
      data: LinkedNodeEmbedsData;
    };
  };
}

interface PointerJsonApi {
  category: string;
  id: string;
  title: string;
  url: string;
}

interface OriginalNodeEmbedsData {
  id: string;
  type: string;
  attributes: {
    title: string;
    description: string;
    category: string;
    custom_citation: string | null;
    date_created: string;
    date_modified: string;
    registration: boolean;
    preprint: boolean;
    fork: boolean;
    collection: boolean;
    tags: string[];
    access_requests_enabled: boolean;
    node_license: {
      copyright_holders: string[];
      year: string | null;
    };
    current_user_can_comment: boolean;
    current_user_permissions: string[];
    current_user_is_contributor: boolean;
    current_user_is_contributor_or_group_member: boolean;
    wiki_enabled: boolean;
    public: boolean;
    subjects: { id: string; text: string }[][];
  };
}

interface UserEmbedsData {
  id: string;
  type: string;
  attributes: {
    full_name: string;
    given_name: string;
    middle_names: string;
    family_name: string;
    suffix: string;
    date_registered: string;
    active: boolean;
    timezone: string;
    locale: string;
    social: {
      ssrn: string;
      orcid: string;
      github: string;
      scholar: string;
      twitter: string;
      linkedIn: string;
      impactStory: string;
      baiduScholar: string;
      researchGate: string;
      researcherId: string;
      profileWebsites: string[];
      academiaProfileID: string;
      academiaInstitution?: string;
    };
    employment: {
      title: string;
      endYear?: number;
      ongoing: boolean;
      endMonth?: number;
      startYear: number;
      department: string;
      startMonth: number;
      institution: string;
    }[];
    education: {
      degree: string;
      endYear?: number;
      ongoing: boolean;
      endMonth?: number;
      startYear: number;
      department: string;
      startMonth: number;
      institution: string;
    }[];
    allow_indexing?: boolean;
    can_view_reviews?: boolean;
    accepted_terms_of_service?: boolean;
    email?: string;
  };
}

interface LinkedNodeEmbedsData {
  id: string;
  type: string;
  attributes: {
    title: string;
    description: string;
    category: string;
    custom_citation: string | null;
    date_created: string;
    date_modified: string;
    registration: boolean;
    preprint: boolean;
    fork: boolean;
    collection: boolean;
    tags: string[];
    access_requests_enabled: boolean;
    node_license: {
      copyright_holders: string[];
      year: string | null;
    };
    current_user_can_comment: boolean;
    current_user_permissions: string[];
    current_user_is_contributor: boolean;
    current_user_is_contributor_or_group_member: boolean;
    wiki_enabled: boolean;
    public: boolean;
    subjects: { id: string; text: string }[][];
  };
}
