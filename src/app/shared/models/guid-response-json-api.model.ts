import { UserPermissions } from '../enums';

import { JsonApiResponse } from './common';

export type GuidedResponseJsonApi = JsonApiResponse<GuidDataJsonApi, null>;

interface GuidDataJsonApi {
  id: string;
  type: string;
  attributes: {
    guid: string;
    wiki_enabled: boolean;
    permissions: UserPermissions[];
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
