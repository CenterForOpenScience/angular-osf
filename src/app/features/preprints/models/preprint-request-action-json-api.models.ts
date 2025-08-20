import { JsonApiResponse } from '@osf/shared/models';

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
