import { ApiData, JsonApiResponse } from '@osf/core/models';

export type GetRegionsResponse = JsonApiResponse<ApiData<{ name: string }, null, null>[], null>;
export type GetRegionResponse = JsonApiResponse<ApiData<{ name: string }, null, null>, null>;
