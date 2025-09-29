import { RegistrationReviewStates, RevisionReviewStates } from '@osf/shared/enums';
import {
  ApiData,
  ContributorDataJsonApi,
  IdentifiersJsonApiData,
  JsonApiResponseWithMeta,
  LicenseDataJsonApi,
  MetaAnonymousJsonApi,
  RegistrationNodeAttributesJsonApi,
  RegistryProviderDetailsJsonApi,
  ResponseJsonApi,
  SchemaResponseDataJsonApi,
} from '@osf/shared/models';

export type GetRegistryOverviewJsonApi = JsonApiResponseWithMeta<
  RegistryOverviewJsonApiData,
  MetaAnonymousJsonApi,
  null
>;

export type RegistryOverviewJsonApiData = ApiData<
  RegistrationNodeAttributesJsonApi,
  RegistryOverviewJsonApiEmbed,
  RegistryOverviewJsonApiRelationships,
  null
>;

export interface RegistryOverviewJsonApiAttributes {
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
  custom_citation?: string | null;
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
  pending_embargo_approval: boolean;
  pending_embargo_termination_approval: boolean;
  pending_registration_approval: boolean;
  pending_withdrawal: boolean;
  revision_state: RevisionReviewStates;
  reviews_state: RegistrationReviewStates;
  embargoed: boolean;
  archiving: boolean;
  withdrawn: boolean;
  withdrawal_justification?: string;
  date_withdrawn?: string | null;
  embargo_end_date?: string;
}

export type RegistrationQuestions = Record<string, string | string[] | { file_id: string; file_name: string }[]>;

export interface RegistryOverviewJsonApiEmbed {
  bibliographic_contributors: {
    data: ContributorDataJsonApi[];
  };
  license: {
    data: LicenseDataJsonApi;
  };
  identifiers: ResponseJsonApi<IdentifiersJsonApiData[]>;
  schema_responses: {
    data: SchemaResponseDataJsonApi[];
  };
  files: {
    data: {
      id: string;
      relationships: {
        files: {
          links: {
            related: {
              href: string;
            };
          };
        };
      };
    }[];
  };
  provider: { data: RegistryProviderDetailsJsonApi };
}

export interface RegistryOverviewJsonApiRelationships {
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
  root: {
    data: {
      id: string;
      type: string;
    };
  };
}
