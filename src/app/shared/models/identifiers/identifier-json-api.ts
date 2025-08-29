import { ApiData, ResponseJsonApi } from '@shared/models';

export type IdentifiersEmbedJsonApiResponse = ResponseJsonApi<IdentifiersEmbedJsonApiData[]>;
export type IdentifiersEmbedJsonApiData = ApiData<IdentifierAttributes, null, null, IdentifierLinks>;

export interface IdentifierAttributes {
  category: string;
  value: string;
}
interface IdentifierLinks {
  self: string;
}
