import { ToOneRelData } from '../common/json-api/relationships.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { DataResponse, ItemResponse } from '../common/json-api/responses.model';

export type OperationInvocationResponseJsonApi = ItemResponse<OperationInvocationDataJsonApi>;

export interface OperationInvocationDataJsonApi extends JsonApiResource<string, OperationInvocationAttributesJsonApi> {
  relationships?: OperationInvocationRelationshipsJsonApi;
}

interface OperationInvocationAttributesJsonApi {
  invocation_status: string;
  operation_kwargs: StorageItemResponseJsonApi;
  operation_result: OperationResultJsonApi | StorageItemResponseJsonApi;
  created: string;
  modified: string;
  operation_name: string;
}

interface OperationInvocationRelationshipsJsonApi {
  thru_account?: ToOneRelData;
  thru_addon?: ToOneRelData;
}

export type OperationInvocationRequestJsonApi = DataResponse<OperationInvocationRequestDataJsonApi>;
interface OperationInvocationRequestDataJsonApi {
  type: string;
  attributes: OperationInvocationRequestAttributesJsonApi;
  relationships: OperationInvocationRelationshipsJsonApi;
}

interface OperationInvocationRequestAttributesJsonApi {
  invocation_status: string | null;
  operation_name: string;
  operation_kwargs: Record<string, unknown>;
  operation_result: Record<string, unknown>;
  created: string | null;
  modified: string | null;
}

export interface StorageItemResponseJsonApi {
  item_id?: string;
  item_name?: string;
  item_type?: string;
  item_link?: string;
  can_be_root?: boolean;
  may_contain_root_candidates?: boolean;
  csl?: Record<string, unknown>;
}

export interface OperationResultJsonApi {
  items: StorageItemResponseJsonApi[];
  total_count: number;
  this_sample_cursor?: string;
  first_sample_cursor?: string;
  next_sample_cursor?: string;
}
