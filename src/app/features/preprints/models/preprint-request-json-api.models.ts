import { PreprintRequestMachineState, PreprintRequestType } from '@osf/features/preprints/enums';
import { JsonApiResponse } from '@osf/shared/models';

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
  creator: {
    data: UserModelJsonApi;
  };
}

interface UserModelJsonApi {
  id: string;
  type: 'users';
  attributes: UserAttributesJsonApi;
}

interface UserAttributesJsonApi {
  full_name: string;
}
