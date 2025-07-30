export interface BibliographicContributorsJsonApi {
  data: BibliographicContributorData[];
  meta: {
    total: number;
    per_page: number;
    total_bibliographic: number;
    version: string;
  };
  links: {
    self: string;
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface BibliographicContributorData {
  id: string;
  type: string;
  attributes: {
    index: number;
  };
  relationships: {
    users: {
      links: {
        related: {
          href: string;
          meta: Record<string, unknown>;
        };
      };
      data: {
        id: string;
        type: string;
      };
    };
  };
  embeds: {
    users: {
      data: {
        id: string;
        type: string;
        attributes: {
          full_name: string;
        };
        links: {
          html: string;
          profile_image: string;
          self: string;
          iri: string;
        };
      };
    };
  };
  links: {
    self: string;
  };
}

export interface BibliographicContributor {
  id: string;
  index: number;
  user: {
    id: string;
    fullName: string;
    profileImage: string;
    htmlUrl: string;
    iri: string;
  };
}

export interface CustomItemMetadataRecord {
  language?: string;
  resource_type_general?: string;
  funders?: {
    funder_name: string;
    funder_identifier?: string;
    funder_identifier_type?: string;
    award_number?: string;
    award_uri?: string;
    award_title?: string;
  }[];
}

export interface CustomItemMetadataResponse {
  data: {
    id: string;
    type: string;
    attributes: CustomItemMetadataRecord;
  };
}

export interface CrossRefFunder {
  id: number;
  location: string;
  name: string;
  alt_names: string[];
  uri: string;
  replaces: number[];
  replaced_by: number | null;
  tokens: string[];
}

export interface CrossRefFundersResponse {
  status: string;
  message_type: string;
  message_version: string;
  message: {
    facets: Record<string, unknown>;
    total_results: number;
    items: CrossRefFunder[];
    items_per_page: number;
  };
}

export interface UserInstitution {
  id: string;
  type: string;
  attributes: {
    name: string;
    description: string;
    logo_path: string | null;
  };
}

export interface UserInstitutionsResponse {
  data: UserInstitution[];
  meta: {
    total: number;
    per_page: number;
    version: string;
  };
  links: {
    self: string;
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface RegistryMetadata {
  tags?: string[];
  description?: string;
  category?: string;
  doi?: boolean;
  node_license?: {
    id: string;
    type: string;
  };
  institutions?: {
    id: string;
    type: string;
  }[];
}

export interface RegistrySubjectsJsonApi {
  data: RegistrySubjectData[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
    meta: {
      total: number;
      per_page: number;
    };
  };
  meta: {
    version: string;
  };
}

export interface RegistrySubjectData {
  id: string;
  type: string;
  attributes: {
    text: string;
    taxonomy_name: string;
  };
  relationships: {
    children: {
      links: {
        related: {
          href: string;
          meta: Record<string, unknown>;
        };
      };
    };
  };
  links: {
    self: string;
    iri: string;
  };
}
