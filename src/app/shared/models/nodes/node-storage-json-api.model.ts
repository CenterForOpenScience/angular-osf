import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse } from '../common/json-api/responses.model';

export type NodeStorageResponseJsonApi = ItemResponse<NodeStorageDataJsonApi>;

export type NodeStorageDataJsonApi = JsonApiResource<'node-storage', NodeStorageAttributesJsonApi>;

interface NodeStorageAttributesJsonApi {
  storage_limit_status: string;
  storage_usage: string;
}
