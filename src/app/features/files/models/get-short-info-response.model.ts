import { ApiData, JsonApiResponse } from '@osf/shared/models/common/json-api.model';
import { IdentifiersResponseJsonApi } from '@osf/shared/models/identifiers/identifier-json-api.model';

export type GetShortInfoResponse = JsonApiResponse<
  ApiData<
    {
      title: string;
      description: string;
      date_created: string;
      date_modified: string;
    },
    { identifiers: IdentifiersResponseJsonApi },
    null,
    null
  >,
  null
>;
