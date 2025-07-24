import { JsonApiResponse } from '@core/models';

export interface MyResourcesItemGetResponseJsonApi {
  id: string;
  type: string;
  attributes: {
    title: string;
    date_created: string;
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

export interface MyResourcesContributor {
  familyName: string;
  fullName: string;
  givenName: string;
  middleName: string;
}

export interface MyResourcesItem {
  id: string;
  type: string;
  title: string;
  dateCreated: string;
  dateModified: string;
  isPublic: boolean;
  contributors: MyResourcesContributor[];
}

export interface MyResourcesItemResponseJsonApi {
  data: MyResourcesItem[];
  links: {
    meta: {
      total: number;
      per_page: number;
    };
  };
}

export interface MyResourcesResponseJsonApi extends JsonApiResponse<MyResourcesItemGetResponseJsonApi[], null> {
  links: {
    meta: {
      total: number;
      per_page: number;
    };
  };
}
