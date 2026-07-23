import { JsonApiResource } from '../common/json-api/resource.model';
import { ItemResponse } from '../common/json-api/responses.model';

export type StyledCitationResponseJsonApi = ItemResponse<StyledCitationDataJsonApi>;

export type StyledCitationDataJsonApi = JsonApiResource<string, StyledCitationJsonApiAttributes>;

interface StyledCitationJsonApiAttributes {
  citation: string;
}
