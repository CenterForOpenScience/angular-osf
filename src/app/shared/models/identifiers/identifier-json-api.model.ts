import { ApiData, ResponseJsonApi } from '@shared/models';

export type IdentifiersResponseJsonApi = ResponseJsonApi<IdentifiersJsonApiData[]>;
export type IdentifiersJsonApiData = ApiData<IdentifierAttributes, null, null, null>;

export interface IdentifierAttributes {
  category: string;
  value: string;
}
