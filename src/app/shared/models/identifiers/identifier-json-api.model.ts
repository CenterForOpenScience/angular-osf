import { ApiData, ResponseJsonApi } from '@shared/models';

export type IdentifiersJsonApiResponse = ResponseJsonApi<IdentifiersJsonApiData[]>;
export type IdentifiersJsonApiData = ApiData<IdentifierAttributes, null, null, IdentifierLinks>;

export interface IdentifierAttributes {
  category: string;
  value: string;
}
interface IdentifierLinks {
  self: string;
}
