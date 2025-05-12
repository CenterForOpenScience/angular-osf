import { ApiData, JsonApiResponse } from '@core/services/json-api/json-api.entity';

export type GetRegionsResponse = JsonApiResponse<ApiData<{ name: string }, null, null>[], null>;
export type GetRegionResponse = JsonApiResponse<ApiData<{ name: string }, null, null>, null>;
