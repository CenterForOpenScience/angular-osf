import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ListResponse } from '@osf/shared/models/common/json-api/responses.model';

export type ListIdentitiesResponseJsonApi = ListResponse<ListIdentitiesDataJsonApi>;

export type ListIdentitiesDataJsonApi = JsonApiResource<string, ExternalIdentityResponseJsonApi>;

interface ExternalIdentityResponseJsonApi {
  external_id: string;
  status: string;
}
