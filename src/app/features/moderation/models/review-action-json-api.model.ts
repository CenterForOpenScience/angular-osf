import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ListResponse } from '@osf/shared/models/common/json-api/responses.model';
import { UserDataErrorResponseJsonApi } from '@osf/shared/models/user/user-json-api.model';

export type ReviewActionsResponseJsonApi = ListResponse<ReviewActionDataJsonApi>;

export interface ReviewActionDataJsonApi extends JsonApiResource<'review-actions', ReviewActionAttributesJsonApi> {
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
  creator: UserDataErrorResponseJsonApi;
}
