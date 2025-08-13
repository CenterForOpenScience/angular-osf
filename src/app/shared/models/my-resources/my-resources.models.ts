import { ResponseJsonApi } from '@shared/models';

export type MyResourcesItemResponseJsonApi = ResponseJsonApi<MyResourcesItem[]>;

export type MyResourcesResponseJsonApi = ResponseJsonApi<MyResourcesItemGetResponseJsonApi[]>;

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
