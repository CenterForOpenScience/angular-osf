import { ApiData, JsonApiResponse } from '@core/models';
import { ProjectOverviewContributor } from '@osf/features/project/overview/models';
import { RegistrySubject } from '@osf/features/registry/models/registry-subject.model';

export interface RegistryOverview {
  id: string;
  type: string;
  isPublic: boolean;
  forksCount: number;
  title: string;
  description: string;
  dateModified: string;
  dateCreated: string;
  dateRegistered?: string;
  registrationType: string;
  doi: string;
  tags: string[];
  contributors: ProjectOverviewContributor[];
  citation: string;
  category: string;
  isFork: boolean;
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
  identifiers?: {
    id: string;
    type: string;
    category: string;
    value: string;
  }[];
  analyticsKey: string;
  currentUserCanComment: boolean;
  currentUserPermissions: string[];
  currentUserIsContributor: boolean;
  currentUserIsContributorOrGroupMember: boolean;
  wikiEnabled: boolean;
  region?: {
    id: string;
    type: string;
  };
  subjects?: RegistrySubject[];
  hasData: boolean;
  hasAnalyticCode: boolean;
  hasMaterials: boolean;
  hasPapers: boolean;
  hasSupplements: boolean;
  questions: RegistrationQuestions;
  registrationSchemaLink: string;
  associatedProjectId: string;
}

export type GetRegistryOverviewJsonApi = JsonApiResponse<RegistryOverviewData, null>;

export type RegistryOverviewData = ApiData<
  RegistryOverviewAttributes,
  RegistryOverviewEmbed,
  RegistryOverviewRelationships,
  null
>;

export interface RegistryOverviewAttributes {
  id: string;
  public: boolean;
  title: string;
  description: string;
  date_modified: string;
  date_created: string;
  date_registered: string;
  registration_supplement: string;
  doi: string;
  tags: string[];
  category: string;
  fork?: boolean;
  accessRequestsEnabled?: boolean;
  node_license?: {
    copyright_holders: string[];
    year: string;
  };
  analyticsKey: string;
  current_user_can_comment: boolean;
  current_user_permissions: string[];
  current_user_is_contributor: boolean;
  current_user_is_contributor_or_group_member: boolean;
  wikiEnabled: boolean;
  has_data: boolean;
  has_analytic_code: boolean;
  has_materials: boolean;
  has_papers: boolean;
  has_supplements: boolean;
  registration_responses: RegistrationQuestions;
}

export type RegistrationQuestions = Record<string, string | string[] | { file_id: string; file_name: string }[]>;

export interface RegistryOverviewEmbed {
  bibliographic_contributors: {
    data: {
      embeds: {
        users: {
          data: {
            attributes: {
              family_name: string;
              full_name: string;
              given_name: string;
              middle_names: string;
            };
            id: string;
            type: string;
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
}

export interface RegistryOverviewRelationships {
  forks: {
    links: {
      related: {
        meta: {
          count: number;
        };
      };
    };
  };
  registered_from: {
    data: {
      id: string;
    };
  };
  citation: {
    data: {
      id: string;
    };
  };
  region?: {
    data: {
      id: string;
      type: string;
    };
  };
  registration_schema: {
    links: {
      related: {
        href: string;
      };
    };
  };
}
