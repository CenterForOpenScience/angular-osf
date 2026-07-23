import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ListResponse } from '@osf/shared/models/common/json-api/responses.model';
import { UserDataErrorResponseJsonApi } from '@osf/shared/models/user/user-json-api.model';

import { PreprintRequestMachineState, PreprintRequestType } from '../enums';

export type PreprintRequestsJsonApiResponse = ListResponse<PreprintRequestDataJsonApi>;

export interface PreprintRequestDataJsonApi extends JsonApiResource<
  'preprint_requests',
  PreprintRequestAttributesJsonApi
> {
  embeds: PreprintRequestEmbedsJsonApi;
}

interface PreprintRequestAttributesJsonApi {
  comment: string;
  created: Date;
  date_last_transitioned: Date;
  machine_state: PreprintRequestMachineState;
  modified: Date;
  request_type: PreprintRequestType;
}

interface PreprintRequestEmbedsJsonApi {
  creator: UserDataErrorResponseJsonApi;
}
