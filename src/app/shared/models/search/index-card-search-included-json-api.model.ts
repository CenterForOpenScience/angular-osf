import { ToOneRelData } from '../common/json-api/relationships.model';
import { JsonApiResource } from '../common/json-api/resource.model';

import {
  MatchEvidencePropertyPathJsonApi,
  RelatedPropertyPathJsonApi,
  ResourceMetadataJsonApi,
} from './index-card-search-metadata-json-api.model';

export type IndexCardSearchIncludedJsonApi =
  | IndexCardDataJsonApi
  | RelatedPropertyPathDataJsonApi
  | SearchResultDataJsonApi;

export type RelatedPropertyPathDataJsonApi = JsonApiResource<
  'related-property-path',
  RelatedPropertyPathAttributesJsonApi
>;

export type IndexCardDataJsonApi = JsonApiResource<'index-card', IndexCardAttributesJsonApi>;

export interface SearchResultDataJsonApi extends Omit<
  JsonApiResource<'search-result', SearchResultAttributesJsonApi>,
  'attributes'
> {
  relationships: SearchResultRelationshipsJsonApi;
  attributes?: SearchResultAttributesJsonApi;
}

interface RelatedPropertyPathAttributesJsonApi {
  propertyPathKey: string;
  propertyPath: RelatedPropertyPathJsonApi[];
  suggestedFilterOperator: string;
  cardSearchResultCount: number;
  osfmapPropertyPath: string[];
}

interface IndexCardAttributesJsonApi {
  resourceIdentifier: string[];
  resourceMetadata: ResourceMetadataJsonApi;
}

interface SearchResultRelationshipsJsonApi {
  indexCard: ToOneRelData<'index-card'>;
}

interface SearchResultAttributesJsonApi {
  matchEvidence: (IriMatchEvidence | TextMatchEvidence)[];
  cardSearchResultCount: number;
}

interface IriMatchEvidence {
  matchingIri: string;
  osfmapPropertyPath: string[];
  propertyPathKey: string;
  propertyPath: MatchEvidencePropertyPathJsonApi[];
}

interface TextMatchEvidence {
  matchingHighlight: string;
  osfmapPropertyPath: string[];
  propertyPathKey: string;
  propertyPath: MatchEvidencePropertyPathJsonApi[];
}
