import { JsonApiResource } from '../common/json-api/resource.model';

import { SearchResultDataJsonApi } from './index-card-search-json-api.model';

export interface FilterOptionsResponseJsonApi {
  data: FilterOptionsResponseData;
  included?: (FilterOptionItem | SearchResultDataJsonApi)[];
}

interface FilterOptionsResponseData {
  attributes: Record<string, unknown>;
  id: string;
  relationships?: Record<string, unknown>;
  type: string;
}

export type FilterOptionItem = JsonApiResource<string, FilterOptionAttributes>;

export interface FilterOptionAttributes {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resourceMetadata: any;
}
