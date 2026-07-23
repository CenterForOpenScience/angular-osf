import { JsonApiResource } from '../common/json-api/resource.model';
import { DataResponse } from '../common/json-api/responses.model';

export type CustomCitationPayloadJsonApi = DataResponse<
  JsonApiResource<string, CustomCitationPayloadJsonApiAttributes>
>;

interface CustomCitationPayloadJsonApiAttributes {
  custom_citation: string;
}
