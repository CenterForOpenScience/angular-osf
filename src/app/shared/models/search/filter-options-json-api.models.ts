import { ApiData } from '../common/json-api.model';

import { SearchResultDataJsonApi } from './index-card-search-json-api.models';

export interface FilterOptionsResponseJsonApi {
  data: FilterOptionsResponseData;
  included?: (FilterOptionItem | SearchResultDataJsonApi)[];
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
