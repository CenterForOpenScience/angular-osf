import { JsonApiResponse } from '@shared/models/common/json-api.model';

export interface InstitutionSearchResultCountJsonApi {
  attributes: {
    cardSearchResultCount: number;
  };
  id: string;
  type: string;
  relationships: {
    indexCard: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}

export interface InstitutionIndexCardFilterJsonApi {
  attributes: {
    resourceIdentifier: string[];
    resourceMetadata: {
      displayLabel: { '@value': string }[];
      '@id': string;
      name: { '@value': string }[];
    };
  };
  id: string;
  type: string;
}

export type InstitutionIndexValueSearchIncludedJsonApi =
  | InstitutionSearchResultCountJsonApi
  | InstitutionIndexCardFilterJsonApi;

export interface InstitutionIndexValueSearchJsonApi
  extends JsonApiResponse<null, InstitutionIndexValueSearchIncludedJsonApi[]> {
  data: null;
  included: InstitutionIndexValueSearchIncludedJsonApi[];
}
