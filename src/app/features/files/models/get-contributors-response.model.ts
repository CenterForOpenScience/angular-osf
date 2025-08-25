import { ApiData, JsonApiResponse } from '@osf/shared/models';

export type GetContributorsResponse = JsonApiResponse<
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
