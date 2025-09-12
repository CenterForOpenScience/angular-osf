import { SearchResultJsonApi } from '@shared/models';

import { ApiData } from '../common';

export interface FilterOptionsResponseJsonApi {
  data: FilterOptionsResponseData;
  included?: (FilterOptionItem | SearchResultJsonApi)[];
  links?: {
    first?: string;
    next?: string;
    prev?: string;
    last?: string;
  };
  meta?: {
    total?: number;
    page?: number;
    'per-page'?: number;
  };
}

interface FilterOptionsResponseData {
  type: string;
  id: string;
  attributes: Record<string, unknown>;
  relationships?: Record<string, unknown>;
}

export type FilterOptionItem = ApiData<FilterOptionAttributes, null, null, null>;

export interface FilterOptionAttributes {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resourceMetadata: any;
}
