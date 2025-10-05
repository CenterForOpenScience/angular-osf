import { ContributorPermission } from '@osf/shared/enums';

import { ResponseJsonApi } from '../common';
import { UserDataJsonApi } from '../user';

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
  creator: {
    data: UserDataJsonApi;
  };
}
