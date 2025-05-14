import { ApiData, JsonApiResponse } from '@core/services/json-api/json-api.entity';

export type ListEmailsResponse = JsonApiResponse<ApiData<AccountEmailResponse, null, null>[], null>;

export interface AccountEmailResponse {
  email_address: string;
  confirmed: boolean;
  verified: boolean;
  primary: boolean;
  is_merge: boolean;
}
