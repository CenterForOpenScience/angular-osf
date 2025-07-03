import { ApiData, JsonApiResponse } from '@core/models';

export type GetResourceSubjectsJsonApi = JsonApiResponse<ApiData<{ text: string }, null, null, null>[], null>;
