import { ApiData, JsonApiResponse } from '@shared/models';
import { IdentifiersJsonApiResponse } from '@shared/models/identifiers/identifier-json-api.model';

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
