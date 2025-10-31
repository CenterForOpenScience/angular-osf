import { UserPermissions } from '../enums/user-permissions.enum';

import { JsonApiResponse } from './common/json-api.model';

export type GuidedResponseJsonApi = JsonApiResponse<GuidDataJsonApi, null>;

interface GuidDataJsonApi {
  id: string;
  type: string;
  attributes: {
    guid: string;
    wiki_enabled: boolean;
    current_user_permissions: UserPermissions[];
    title?: string;
  };
  relationships: {
    target?: {
      data: IdType;
    };
    provider?: {
      data: IdType;
    };
    root?: {
      data: IdType;
    };
  };
}

interface IdType {
  id: string;
  type: string;
}
