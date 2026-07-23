import { JsonApiResource } from '../common/json-api/resource.model';
import { ListResponse } from '../common/json-api/responses.model';

export type IdentifiersResponseJsonApi = ListResponse<IdentifiersJsonApiData>;

export type IdentifiersJsonApiData = JsonApiResource<'identifiers', IdentifierAttributesJsonApi>;

interface IdentifierAttributesJsonApi {
  category: string;
  value: string;
}
