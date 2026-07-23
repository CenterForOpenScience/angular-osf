import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ListResponse } from '@osf/shared/models/common/json-api/responses.model';
import { UserDataErrorResponseJsonApi } from '@osf/shared/models/user/user-json-api.model';

export type PreprintRequestActionsJsonApiResponse = ListResponse<PreprintRequestActionDataJsonApi>;

export interface PreprintRequestActionDataJsonApi extends JsonApiResource<
  'preprint_request_actions',
  PreprintRequestActionAttributesJsonApi
> {
  embeds: PreprintRequestActionEmbedsJsonApi;
}

interface PreprintRequestActionAttributesJsonApi {
  comment: string;
  date_created: Date;
  date_modified: Date;
  from_state: string;
  to_state: string;
  trigger: string;
}

interface PreprintRequestActionEmbedsJsonApi {
  creator: UserDataErrorResponseJsonApi;
}
