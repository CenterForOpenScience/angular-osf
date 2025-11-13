import { ApiData, ResponseJsonApi } from '../common/json-api.model';

export type IdentifiersResponseJsonApi = ResponseJsonApi<IdentifiersJsonApiData[]>;
export type IdentifiersJsonApiData = ApiData<IdentifierAttributes, null, null, null>;

export interface IdentifierAttributes {
  category: string;
  value: string;
}
