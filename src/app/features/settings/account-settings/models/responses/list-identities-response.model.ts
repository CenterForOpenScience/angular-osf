import { ApiData, JsonApiResponse } from '@osf/shared/models/common/json-api.model';

export type ListIdentitiesResponseJsonApi = JsonApiResponse<
  ApiData<ExternalIdentityResponseJsonApi, null, null, null>[],
  null
>;

export interface ExternalIdentityResponseJsonApi {
  external_id: string;
  status: string;
}
