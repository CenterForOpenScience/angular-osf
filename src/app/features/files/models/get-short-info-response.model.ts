import { ApiData, IdentifiersJsonApiResponse, JsonApiResponse } from '@shared/models';

export type GetShortInfoResponse = JsonApiResponse<
  ApiData<
    {
      title: string;
      description: string;
      date_created: string;
      date_modified: string;
    },
    { identifiers: IdentifiersJsonApiResponse },
    null,
    null
  >,
  null
>;
