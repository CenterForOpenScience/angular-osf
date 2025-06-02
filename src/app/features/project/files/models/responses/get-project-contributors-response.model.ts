import { ApiData, JsonApiResponse } from '@core/models';

export type GetProjectContributorsResponse = JsonApiResponse<
  ApiData<
    {
      full_name: string;
      active: boolean;
    },
    null,
    null,
    null
  >[],
  null
>;
