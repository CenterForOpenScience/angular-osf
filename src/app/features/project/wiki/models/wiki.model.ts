import { JsonApiResponse } from '@core/services/json-api/json-api.entity';

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

export interface HomeWikiJsonApiResponse extends JsonApiResponse<HomeWikiGetResponse[], null> {
  data: HomeWikiGetResponse[];
}
