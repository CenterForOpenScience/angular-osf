import { UserPermissions } from '../enums';

import { JsonApiResponse } from './common';

export type GuidedResponseJsonApi = JsonApiResponse<GuidDataJsonApi, null>;

interface GuidDataJsonApi {
  id: string;
  type: string;
  attributes: {
    guid: string;
    wiki_enabled: boolean;
    current_user_permissions: UserPermissions[];
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
