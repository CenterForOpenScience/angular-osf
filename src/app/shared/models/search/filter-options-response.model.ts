import { ApiData } from '@osf/core/models';

import { FilterOptionAttributes } from './filter-option.model';

export interface FilterOptionsResponseData {
  type: string;
  id: string;
  attributes: Record<string, unknown>;
  relationships?: Record<string, unknown>;
}

export interface FilterOptionsResponseJsonApi {
  data: FilterOptionsResponseData;
  included?: FilterOptionItem[];
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

export type FilterOptionItem = ApiData<FilterOptionAttributes, null, null, null>;
