import { Embed } from '@osf/shared/models/common/json-api/embeds.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse, ListResponse } from '@osf/shared/models/common/json-api/responses.model';
import { UserDataJsonApi } from '@osf/shared/models/user/user-json-api.model';

export type ModeratorResponseJsonApi = ListResponse<ModeratorDataJsonApi>;
export type ModeratorItemResponseJsonApi = ItemResponse<ModeratorDataJsonApi>;

export interface ModeratorDataJsonApi extends JsonApiResource<'moderators', ModeratorAttributesJsonApi> {
  embeds: ModeratorEmbedsJsonApi;
}

export interface ModeratorAddRequestModel {
  attributes: ModeratorAddAttributesJsonApi;
  type: 'moderators';
}

interface ModeratorAddAttributesJsonApi {
  email?: string;
  full_name?: string;
  id?: string;
  permission_group: string;
}

interface ModeratorAttributesJsonApi {
  full_name: string;
  permission_group: 'admin' | 'moderator';
}

interface ModeratorEmbedsJsonApi {
  user: Embed<UserDataJsonApi>;
}
