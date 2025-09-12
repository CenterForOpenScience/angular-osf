import { ApiData, JsonApiResponse } from '@osf/shared/models';
import { IdentifiersJsonApiResponse } from '@shared/models/identifiers/identifier-json-api.model';

export type GetResourceShortInfoResponse = JsonApiResponse<
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
