export interface ActivityLogJsonApi {
  id: string;
  type: string;
  attributes: {
    action: string;
    date: string;
    params: {
      contributors: LogContributorJsonApi[];
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
      preprint_provider?:
        | string
        | {
            url: string;
            name: string;
          }
        | null;
      addon?: string;
      anonymous_link?: boolean;
      file?: {
        name: string;
        url: string;
      };
      wiki?: {
        name: string;
        url: string;
      };
      destination?: {
        materialized: string;
        addon: string;
        url: string;
      };
      identifiers?: {
        doi?: string;
        ark?: string;
      };
      kind?: string;
      old_page?: string;
      page?: string;
      page_id?: string;
      path?: string;
      urls?: {
        view: string;
      };
      preprint?: string;
      source?: {
        materialized: string;
        addon: string;
      };
      title_new?: string;
      title_original?: string;
      updated_fields?: Record<
        string,
        {
          new: string;
          old: string;
        }
      >;
      value?: string;
      version?: string;
      github_user?: string;
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
  meta: {
    total: number;
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
    } | null;
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
    } | null;
    current_user_can_comment: boolean;
    current_user_permissions: string[];
    current_user_is_contributor: boolean;
    current_user_is_contributor_or_group_member: boolean;
    wiki_enabled: boolean;
    public: boolean;
    subjects: {
      id: string;
      text: string;
    }[][];
  };
}

export interface LogContributorJsonApi {
  id: string;
  full_name: string;
  given_name: string;
  middle_names: string;
  family_name: string;
  unregistered_name: string | null;
  active: boolean;
}
