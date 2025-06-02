import { ApiData, JsonApiResponse } from '@core/models';

export type GetProjectShortInfoResponse = JsonApiResponse<
  ApiData<
    {
      title: string;
      description: string;
      date_created: string;
      date_modified: string;
    },
    null,
    null,
    null
  >,
  null
>;
