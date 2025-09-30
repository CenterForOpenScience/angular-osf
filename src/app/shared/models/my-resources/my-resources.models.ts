import { ContributorDataJsonApi, ContributorModel, ResponseJsonApi } from '@shared/models';

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
      data: ContributorDataJsonApi[];
    };
  };
}

export interface MyResourcesItem {
  id: string;
  type: string;
  title: string;
  dateCreated: string;
  dateModified: string;
  isPublic: boolean;
  contributors: ContributorModel[];
}
