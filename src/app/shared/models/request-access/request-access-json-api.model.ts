import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';

import { JsonApiResource } from '../common/json-api/resource.model';
import { ListResponse } from '../common/json-api/responses.model';
import { UserDataErrorResponseJsonApi } from '../user/user-json-api.model';

export type RequestAccessResponseJsonApi = ListResponse<RequestAccessDataJsonApi>;

export interface RequestAccessDataJsonApi extends JsonApiResource<'node-requests', RequestAccessAttributesJsonApi> {
  embeds: RequestAccessEmbedsJsonApi;
}

interface RequestAccessAttributesJsonApi {
  comment: string;
  created: string;
  date_last_transitioned: string;
  machine_state: string;
  modified: string;
  request_type: string;
  requested_permissions: ContributorPermission | null;
}

interface RequestAccessEmbedsJsonApi {
  creator: UserDataErrorResponseJsonApi;
}
