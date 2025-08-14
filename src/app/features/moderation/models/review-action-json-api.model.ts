import { JsonApiResponse } from '@osf/shared/models';

export type ReviewActionsResponseJsonApi = JsonApiResponse<ReviewActionsDataJsonApi[], null>;

export interface ReviewActionsDataJsonApi {
  id: string;
  attributes: ReviewActionAttributesJsonApi;
  embeds: ReviewActionEmbedsJsonApi;
}

interface ReviewActionAttributesJsonApi {
  auto: boolean;
  comment: string;
  date_created: string;
  date_modified: string;
  from_state: string;
  to_state: string;
  trigger: string;
  visible: true;
}

interface ReviewActionEmbedsJsonApi {
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
