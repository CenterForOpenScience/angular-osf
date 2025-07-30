export interface LinkedNodeJsonApi {
  id: string;
  type: 'nodes';
  attributes: {
    title: string;
    description: string;
    category: string;
    custom_citation: string;
    date_created: string;
    date_modified: string;
    registration: boolean;
    preprint: boolean;
    fork: boolean;
    collection: boolean;
    tags: string[];
    node_license?: {
      copyright_holders: string[];
      year: string;
    };
    analytics_key: string;
    current_user_can_comment: boolean;
    current_user_permissions: string[];
    current_user_is_contributor: boolean;
    current_user_is_contributor_or_group_member: boolean;
    wiki_enabled: boolean;
    public: boolean;
  };
  relationships: {
    license: {
      links: {
        related: {
          href: string;
          meta: Record<string, unknown>;
        };
      };
      data: {
        id: string;
        type: 'licenses';
      };
    };
    children: {
      links: {
        related: {
          href: string;
          meta: Record<string, unknown>;
        };
      };
    };
    contributors: {
      links: {
        related: {
          href: string;
          meta: Record<string, unknown>;
        };
      };
    };
    files: {
      links: {
        related: {
          href: string;
          meta: Record<string, unknown>;
        };
      };
    };
    parent: {
      data: null | {
        id: string;
        type: 'nodes';
      };
    };
    root: {
      links: {
        related: {
          href: string;
          meta: Record<string, unknown>;
        };
      };
      data: {
        id: string;
        type: 'nodes';
      };
    };
    linked_nodes: {
      links: {
        related: {
          href: string;
          meta: Record<string, unknown>;
        };
        self: {
          href: string;
          meta: Record<string, unknown>;
        };
      };
    };
    linked_registrations: {
      links: {
        related: {
          href: string;
          meta: Record<string, unknown>;
        };
        self: {
          href: string;
          meta: Record<string, unknown>;
        };
      };
    };
  };
  links: {
    html: string;
    self: string;
    iri: string;
  };
}

export interface LinkedNodesJsonApiResponse {
  data: LinkedNodeJsonApi[];
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
