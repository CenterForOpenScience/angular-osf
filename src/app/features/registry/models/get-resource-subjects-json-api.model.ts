import { ApiData, JsonApiResponse } from '@shared/models';

export type GetResourceSubjectsJsonApi = JsonApiResponse<ApiData<{ text: string }, null, null, null>[], null>;
