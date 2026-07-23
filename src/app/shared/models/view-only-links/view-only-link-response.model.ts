import { EmbedList } from '../common/json-api/embeds.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse, ListResponse } from '../common/json-api/responses.model';
import { BaseNodeDataJsonApi } from '../nodes/base-node-data-json-api.model';
import { UserDataErrorResponseJsonApi } from '../user/user-json-api.model';

export type ViewOnlyLinksResponsesJsonApi = ListResponse<ViewOnlyLinkJsonApi>;
export type ViewOnlyLinksResponseJsonApi = ItemResponse<ViewOnlyLinkJsonApi>;

export interface ViewOnlyLinkJsonApi extends JsonApiResource<'view_only_links', ViewOnlyLinkAttributesJsonApi> {
  embeds: ViewOnlyLinkEmbedsJsonApi;
}

interface ViewOnlyLinkEmbedsJsonApi {
  creator: UserDataErrorResponseJsonApi;
  nodes: EmbedList<BaseNodeDataJsonApi>;
}

interface ViewOnlyLinkAttributesJsonApi {
  anonymous: boolean;
  date_created: string;
  key: string;
  name: string;
}
