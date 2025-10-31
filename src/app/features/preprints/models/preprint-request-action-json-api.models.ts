import { JsonApiResponse } from '@osf/shared/models/common/json-api.model';
import { UserDataErrorResponseJsonApi } from '@osf/shared/models/user/user-json-api.model';

export type PreprintRequestActionsJsonApiResponse = JsonApiResponse<PreprintRequestActionDataJsonApi[], null>;

export interface PreprintRequestActionDataJsonApi {
  id: string;
  type: 'preprint_request_actions';
  attributes: PreprintRequestActionsAttributesJsonApi;
  embeds: PreprintRequestEmbedsJsonApi;
}

interface PreprintRequestActionsAttributesJsonApi {
  trigger: string;
  comment: string;
  from_state: string;
  to_state: string;
  date_created: Date;
  date_modified: Date;
}

interface PreprintRequestEmbedsJsonApi {
  creator: UserDataErrorResponseJsonApi;
}
