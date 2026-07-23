import { UserPermissions } from '../enums/user-permissions.enum';

import { ToOneRel } from './common/json-api/relationships.model';
import { JsonApiResource } from './common/json-api/resource.model';
import { ItemResponse } from './common/json-api/responses.model';

export type GuidedResponseJsonApi = ItemResponse<GuidDataJsonApi>;

export interface GuidDataJsonApi extends JsonApiResource<string, GuidAttributesJsonApi> {
  relationships: GuidRelationshipsJsonApi;
}

interface GuidAttributesJsonApi {
  current_user_permissions: UserPermissions[];
  guid: string;
  title?: string;
  wiki_enabled: boolean;
}

interface GuidRelationshipsJsonApi {
  provider?: ToOneRel;
  root?: ToOneRel;
  target?: ToOneRel;
}
