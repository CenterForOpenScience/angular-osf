import { JsonApiResponse, JsonApiResponseWithMeta, MetaAnonymousJsonApi } from '../common';

export enum WikiModes {
  View = 'view',
  Edit = 'edit',
  Compare = 'compare',
}

export interface Wiki {
  id: string;
  name: string;
  kind: string;
}

export interface WikisWithMeta {
  wikis: Wiki[];
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
  list: Wiki[];
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
    user: {
      data: {
        id: string;
        attributes: {
          full_name: string;
        };
      };
    };
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
