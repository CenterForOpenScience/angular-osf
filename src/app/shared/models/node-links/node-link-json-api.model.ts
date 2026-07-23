import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse } from '../common/json-api/responses.model';

export type NodeLinkResponseJsonApi = ItemResponse<NodeLinkDataJsonApi>;

type NodeLinkDataJsonApi = JsonApiResource<'node-links', NodeLinkAttributesJsonApi>;

interface NodeLinkAttributesJsonApi {
  id: string;
  type: 'nodes';
}
