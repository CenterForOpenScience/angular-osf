import { ApiData, JsonApiResponse } from '@core/services/json-api/json-api.entity';

export type ListIdentitiesResponse = JsonApiResponse<ApiData<ExternalIdentityResponse, null, null>[], null>;

export interface ExternalIdentityResponse {
  external_id: string;
  status: string;
}
