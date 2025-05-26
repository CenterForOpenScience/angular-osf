import { ApiData, JsonApiResponse } from '@osf/core/models';

export type ListIdentitiesResponse = JsonApiResponse<ApiData<ExternalIdentityResponse, null, null>[], null>;

export interface ExternalIdentityResponse {
  external_id: string;
  status: string;
}
