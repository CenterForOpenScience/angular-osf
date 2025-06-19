import { JsonApiResponse } from '@osf/core/models';

export interface ProjectOverviewContributor {
  familyName: string;
  fullName: string;
  givenName: string;
  middleName: string;
  id: string;
  type: string;
}

export interface ComponentOverview {
  id: string;
  type: string;
  title: string;
  description: string;
  public: boolean;
  contributors: ProjectOverviewContributor[];
}

export interface ComponentGetResponseJsoApi {
  id: string;
  type: string;
  attributes: {
    title: string;
    description: string;
    public: boolean;
  };
  embeds: {
    bibliographic_contributors: {
      data: {
        embeds: {
          users: {
            data: {
              id: string;
              type: string;
              attributes: {
                family_name: string;
                full_name: string;
                given_name: string;
                middle_name: string;
              };
            };
          };
        };
      }[];
    };
  };
}

export interface ProjectOverview {
  id: string;
  type: string;
  title: string;
  description: string;
  dateModified: string;
  dateCreated: string;
  isPublic: boolean;
  category: string;
  isRegistration: boolean;
  isPreprint: boolean;
  isFork: boolean;
  isCollection: boolean;
  tags: string[];
  accessRequestsEnabled: boolean;
  nodeLicense?: {
    copyrightHolders: string[];
    year: string;
  };
  license?: {
    name: string;
    text: string;
    url: string;
  };
  doi?: string;
  publicationDoi?: string;
  storage?: {
    id: string;
    type: string;
    storageLimitStatus: string;
    storageUsage: string;
  };
  identifiers?: {
    id: string;
    type: string;
    category: string;
    value: string;
  }[];
  supplements?: {
    id: string;
    type: string;
    title: string;
    dateCreated: string;
    url: string;
  }[];
  analyticsKey: string;
  currentUserCanComment: boolean;
  currentUserPermissions: string[];
  currentUserIsContributor: boolean;
  currentUserIsContributorOrGroupMember: boolean;
  wikiEnabled: boolean;
  subjects: ProjectOverviewSubject[];
  contributors: ProjectOverviewContributor[];
  region?: {
    id: string;
    type: string;
  };
  affiliatedInstitutions?: {
    id: string;
    type: string;
    name: string;
    description: string;
    logo: string;
  }[];
  forksCount: number;
  viewOnlyLinksCount: number;
}

export interface ProjectOverviewSubject {
  id: string;
  text: string;
}

export interface ProjectOverviewGetResponseJsoApi {
  id: string;
  type: string;
  attributes: {
    title: string;
    description: string;
    date_modified: string;
    date_created: string;
    public: boolean;
    category: string;
    registration: boolean;
    preprint: boolean;
    fork: boolean;
    collection: boolean;
    tags: string[];
    access_requests_enabled: boolean;
    node_license?: {
      copyright_holders: string[];
      year: string;
    };
    doi?: string;
    publication_doi?: string;
    analytics_key: string;
    current_user_can_comment: boolean;
    current_user_permissions: string[];
    current_user_is_contributor: boolean;
    current_user_is_contributor_or_group_member: boolean;
    wiki_enabled: boolean;
    subjects: ProjectOverviewSubject[][];
  };
  embeds: {
    affiliated_institutions: {
      data: {
        id: string;
        type: string;
        attributes: {
          assets: {
            logo: string;
          };
          description: string;
          name: string;
        };
      }[];
    };
    identifiers: {
      data: {
        id: string;
        type: string;
        attributes: {
          category: string;
          value: string;
        };
      }[];
    };
    bibliographic_contributors: {
      data: {
        embeds: {
          users: {
            data: {
              id: string;
              type: string;
              attributes: {
                family_name: string;
                full_name: string;
                given_name: string;
                middle_name: string;
              };
            };
          };
        };
      }[];
    };
    license: {
      data: {
        id: string;
        type: string;
        attributes: {
          name: string;
          text: string;
          url: string;
        };
      };
    };
    preprints: {
      data: {
        id: string;
        type: string;
        attributes: {
          date_created: string;
          title: string;
        };
        links: {
          html: string;
        };
      }[];
    };
    storage: {
      data?: {
        id: string;
        type: string;
        attributes: {
          storage_limit_status: string;
          storage_usage: string;
        };
      };
      errors?: {
        detail: string;
      }[];
    };
  };
  relationships: {
    region?: {
      data: {
        id: string;
        type: string;
      };
    };
    forks: {
      links: {
        related: {
          meta: {
            count: number;
          };
        };
      };
    };
    view_only_links: {
      links: {
        related: {
          meta: {
            count: number;
          };
        };
      };
    };
  };
}

export interface ProjectOverviewResponseJsoApi extends JsonApiResponse<ProjectOverviewGetResponseJsoApi, null> {
  data: ProjectOverviewGetResponseJsoApi;
}
