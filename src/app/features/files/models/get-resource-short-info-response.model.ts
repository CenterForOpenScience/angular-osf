import { ApiData, JsonApiResponse } from '@osf/shared/models';

export type GetResourceShortInfoResponse = JsonApiResponse<
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
