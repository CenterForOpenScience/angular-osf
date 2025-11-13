import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';

import { ResponseJsonApi } from '../common/json-api.model';
import { UserDataErrorResponseJsonApi } from '../user/user-json-api.model';

export type RequestAccessResponseJsonApi = ResponseJsonApi<RequestAccessDataJsonApi[]>;

export interface RequestAccessDataJsonApi {
  id: string;
  type: 'node-requests';
  attributes: RequestAccessAttributesJsonApi;
  embeds: RequestAccessEmbedsJsonApi;
}

export interface RequestAccessAttributesJsonApi {
  request_type: string;
  machine_state: string;
  comment: string;
  created: string;
  modified: string;
  date_last_transitioned: string;
  requested_permissions: ContributorPermission | null;
}

export interface RequestAccessEmbedsJsonApi {
  creator: UserDataErrorResponseJsonApi;
}
