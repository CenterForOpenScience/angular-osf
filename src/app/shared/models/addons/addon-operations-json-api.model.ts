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

export interface OperationInvocationRequestJsonApi {
  data: {
    attributes: {
      invocation_status: string | null;
      operation_name: string;
      operation_kwargs: Record<string, unknown>;
      operation_result: Record<string, unknown>;
      created: string | null;
      modified: string | null;
    };
    relationships: {
      thru_account?: {
        data: {
          type: string;
          id: string;
        };
      };
      thru_addon?: {
        data: {
          type: string;
          id: string;
        };
      };
    };
    type: string;
  };
}

export interface OperationInvocationResponseJsonApi {
  type: string;
  id: string;
  attributes: {
    invocation_status: string;
    operation_kwargs: StorageItemResponseJsonApi;
    operation_result: OperationResultJsonApi | StorageItemResponseJsonApi;
    created: string;
    modified: string;
    operation_name: string;
  };
  relationships?: {
    thru_account?: {
      data: {
        type: string;
        id: string;
      };
    };
    thru_addon?: {
      data: {
        type: string;
        id: string;
      } | null;
    };
  };
  links: {
    self: string;
  };
}
