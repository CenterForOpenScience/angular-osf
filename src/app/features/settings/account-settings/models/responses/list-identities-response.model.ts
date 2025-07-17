import { ApiData, JsonApiResponse } from '@osf/core/models';

export type ListIdentitiesResponseJsonApi = JsonApiResponse<
  ApiData<ExternalIdentityResponseJsonApi, null, null, null>[],
  null
>;

export interface ExternalIdentityResponseJsonApi {
  external_id: string;
  status: string;
}
