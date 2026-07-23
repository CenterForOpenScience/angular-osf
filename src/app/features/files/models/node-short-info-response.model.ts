import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ItemResponse } from '@osf/shared/models/common/json-api/responses.model';
import { IdentifiersResponseJsonApi } from '@osf/shared/models/identifiers/identifier-json-api.model';

export type NodeShortInfoResponse = ItemResponse<NodeShortInfoDataJsonApi>;

export interface NodeShortInfoDataJsonApi extends JsonApiResource<string, NodeShortInfoAttributesJsonApi> {
  embeds?: NodeShortInfoEmbedsJsonApi;
}

interface NodeShortInfoAttributesJsonApi {
  date_created: string;
  date_modified: string;
  description: string;
  title: string;
}

interface NodeShortInfoEmbedsJsonApi {
  identifiers: IdentifiersResponseJsonApi;
}
