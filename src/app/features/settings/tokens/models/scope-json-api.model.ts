import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { ListResponse } from '@osf/shared/models/common/json-api/responses.model';

export type ScopeJsonApiResponse = ListResponse<ScopeDataJsonApi>;

export type ScopeDataJsonApi = JsonApiResource<'scopes', ScopeAttributesJsonApi>;

interface ScopeAttributesJsonApi {
  description: string;
}
