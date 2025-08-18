import { ApiData, JsonApiResponse } from '@osf/shared/models';

export type GetRegionsResponseJsonApi = JsonApiResponse<ApiData<{ name: string }, null, null, null>[], null>;
export type GetRegionResponseJsonApi = JsonApiResponse<ApiData<{ name: string }, null, null, null>, null>;
