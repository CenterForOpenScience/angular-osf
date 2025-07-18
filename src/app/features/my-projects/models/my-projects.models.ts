import { JsonApiResponse } from '@osf/core/models';

export interface MyProjectsItemGetResponseJsonApi {
  id: string;
  type: string;
  attributes: {
    title: string;
    date_modified: string;
    public: boolean;
  };
  embeds: {
    bibliographic_contributors: {
      data: {
        embeds: {
          users: {
            data: {
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
      links: {
        meta: {
          total: number;
          per_page: number;
        };
      };
    };
  };
}

export interface MyProjectsContributor {
  familyName: string;
  fullName: string;
  givenName: string;
  middleName: string;
}

export interface MyProjectsItem {
  id: string;
  type: string;
  title: string;
  dateModified: string;
  isPublic: boolean;
  contributors: MyProjectsContributor[];
}

export interface MyProjectsItemResponseJsonApi {
  data: MyProjectsItem[];
  links: {
    meta: {
      total: number;
      per_page: number;
    };
  };
}

export interface MyProjectsResponseJsonApi extends JsonApiResponse<MyProjectsItemGetResponseJsonApi[], null> {
  links: {
    meta: {
      total: number;
      per_page: number;
    };
  };
}
