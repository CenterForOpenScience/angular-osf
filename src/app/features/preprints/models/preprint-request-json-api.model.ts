import { PreprintRequestMachineState, PreprintRequestType } from '@osf/features/preprints/enums';
import { JsonApiResponse } from '@osf/shared/models/common/json-api.model';
import { UserDataErrorResponseJsonApi } from '@osf/shared/models/user/user-json-api.model';

export type PreprintRequestsJsonApiResponse = JsonApiResponse<PreprintRequestDataJsonApi[], null>;

export interface PreprintRequestDataJsonApi {
  id: string;
  type: 'preprint_requests';
  attributes: PreprintRequestAttributesJsonApi;
  embeds: PreprintRequestEmbedsJsonApi;
}

interface PreprintRequestAttributesJsonApi {
  request_type: PreprintRequestType;
  machine_state: PreprintRequestMachineState;
  comment: string;
  created: Date;
  modified: Date;
  date_last_transitioned: Date;
}

interface PreprintRequestEmbedsJsonApi {
  creator: UserDataErrorResponseJsonApi;
}
