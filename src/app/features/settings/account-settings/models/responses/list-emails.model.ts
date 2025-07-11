import { ApiData, JsonApiResponse } from '@osf/core/models';

export type ListEmailsResponseJsonApi = JsonApiResponse<ApiData<AccountEmailResponseJsonApi, null, null, null>[], null>;

export interface AccountEmailResponseJsonApi {
  email_address: string;
  confirmed: boolean;
  verified: boolean;
  primary: boolean;
  is_merge: boolean;
}
