import { ApiData, JsonApiResponse } from '@core/models';
import { ProjectOverviewContributor } from '@osf/features/project/overview/models';

export interface RegistryOverview {
  id: string;
  isPublic: boolean;
  forksCount: number;
  title: string;
  description: string;
  dateModified: string;
  dateCreated: string;
  registrationType: string;
  associatedProject: string;
  doi: string;
  tags: string[];
  contributors: ProjectOverviewContributor[];
  citation: string;
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
  registration_supplement: string;
  doi: string;
  tags: string[];
}

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
  registered_form: {
    data: {
      id: string;
    };
  };
  citation: {
    data: {
      id: string;
    };
  };
}
