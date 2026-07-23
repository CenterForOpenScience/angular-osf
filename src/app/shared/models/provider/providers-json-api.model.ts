import { ReviewPermissions } from '@osf/shared/enums/review-permissions.enum';

import { JsonApiResource } from '../common/json-api/resource.model';
import { ListResponse } from '../common/json-api/responses.model';

export type ProvidersResponseJsonApi = ListResponse<ProviderDataJsonApi>;

export type ProviderDataJsonApi = JsonApiResource<string, ProviderAttributesJsonApi>;

interface ProviderAttributesJsonApi {
  name: string;
  permissions?: ReviewPermissions[];
}
