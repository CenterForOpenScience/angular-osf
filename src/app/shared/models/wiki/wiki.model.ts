import { UserDataErrorResponseJsonApi } from '@shared/models/user/user-json-api.model';

import { JsonApiResponse, JsonApiResponseWithMeta, MetaAnonymousJsonApi } from '../common/json-api.model';

export enum WikiModes {
  View = 'view',
  Edit = 'edit',
  Compare = 'compare',
}

export interface WikiModel {
  id: string;
  name: string;
  kind: string;
}

export interface WikisWithMeta {
  wikis: WikiModel[];
  meta: MetaAnonymousJsonApi;
}

export interface WikiVersion {
  id: string;
  createdAt: string;
  createdBy: string;
}

export interface ComponentWiki {
  id: string;
  title: string;
  list: WikiModel[];
}

export interface HomeWiki {
  id: string;
  name: string;
  contentType: string;
  downloadLink: string;
  content?: string;
}

export interface HomeWikiGetResponse {
  id: string;
  type: string;
  attributes: {
    name: string;
    content_type: string;
  };
  links: {
    download: string;
  };
}

export interface WikiGetResponse {
  id: string;
  type: string;
  attributes: {
    name: string;
    kind: string;
  };
}

export interface ComponentsWikiGetResponse {
  id: string;
  type: string;
  attributes: {
    title: string;
  };
  embeds: {
    wikis: {
      data: WikiGetResponse[];
    };
  };
}

export interface WikiVersionJsonApi {
  id: string;
  type: string;
  attributes: {
    date_created: string;
  };
  embeds: {
    user: UserDataErrorResponseJsonApi;
  };
}

export interface HomeWikiJsonApiResponse extends JsonApiResponse<HomeWikiGetResponse[], null> {
  data: HomeWikiGetResponse[];
}

export interface WikiJsonApiResponse extends JsonApiResponse<WikiGetResponse[], null> {
  data: WikiGetResponse[];
}

export interface WikiJsonApiResponseWithMeta
  extends JsonApiResponseWithMeta<WikiGetResponse[], MetaAnonymousJsonApi, null> {
  data: WikiGetResponse[];
}

export interface ComponentsWikiJsonApiResponse extends JsonApiResponse<ComponentsWikiGetResponse[], null> {
  data: ComponentsWikiGetResponse[];
}

export interface WikiVersionJsonApiResponse extends JsonApiResponse<WikiVersionJsonApi[], null> {
  data: WikiVersionJsonApi[];
}
