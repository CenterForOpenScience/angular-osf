import { JsonApiResponse } from './common';

export type GuidedResponseJsonApi = JsonApiResponse<GuidDataJsonApi, null>;

interface GuidDataJsonApi {
  id: string;
  type: string;
  attributes: {
    guid: string;
    wiki_enabled: boolean;
  };
  relationships: {
    target?: {
      data: IdType;
    };
    provider?: {
      data: IdType;
    };
  };
}

interface IdType {
  id: string;
  type: string;
}
