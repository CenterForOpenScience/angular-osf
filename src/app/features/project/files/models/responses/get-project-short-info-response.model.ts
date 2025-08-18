import { ApiData, JsonApiResponse } from '@shared/models';

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
