export interface StorageItemResponseJsonApi {
  item_id?: string;
  item_name?: string;
  item_type?: string;
  can_be_root?: boolean;
  may_contain_root_candidates?: boolean;
}

export interface OperationResult {
  items: StorageItemResponseJsonApi[];
  total_count: number;
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
    operation_result: OperationResult | StorageItemResponseJsonApi;
    created: string;
    modified: string;
    operation_name: string;
  };
  links: {
    self: string;
  };
}

export interface StorageItem {
  itemId?: string;
  itemName?: string;
  itemType?: string;
  canBeRoot?: boolean;
  mayContainRootCandidates?: boolean;
}

export interface OperationInvocation {
  id: string;
  type: string;
  invocationStatus: string;
  operationName: string;
  operationKwargs: {
    itemId?: string;
    itemType?: string;
  };
  operationResult: StorageItem[];
  itemCount: number;
}
