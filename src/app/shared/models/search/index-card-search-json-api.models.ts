import { AppliedFilter, RelatedPropertyPathAttributes } from '@shared/mappers';
import { ApiData, JsonApiResponse } from '@shared/models';

export type IndexCardSearchResponseJsonApi = JsonApiResponse<
  {
    attributes: {
      totalResultCount: number;
      cardSearchFilter?: AppliedFilter[];
    };
    relationships: {
      searchResultPage: {
        data: { id: string }[];
        links: {
          first: {
            href: string;
          };
          next: {
            href: string;
          };
          prev?: {
            href: string;
          };
        };
      };
    };
    links: {
      self: string;
    };
  },
  (IndexCardDataJsonApi | ApiData<RelatedPropertyPathAttributes, null, null, null> | SearchResultJsonApi)[]
>;

export interface SearchResultJsonApi {
  id: string;
  type: 'search-result';
  relationships: {
    indexCard: {
      data: {
        id: string;
        type: 'index-card';
      };
    };
  };
  attributes?: {
    matchEvidence: (IriMatchEvidence | TextMatchEvidence)[];
    cardSearchResultCount: number;
  };
}

export type IndexCardDataJsonApi = ApiData<IndexCardAttributesJsonApi, null, null, null>;

interface IndexCardAttributesJsonApi {
  resourceIdentifier: string[];
  resourceMetadata: ResourceMetadataJsonApi;
}

interface ResourceMetadataJsonApi {
  '@id': string;
  resourceType: { '@id': string }[];
  name: { '@value': string }[];
  title: { '@value': string }[];
  fileName: { '@value': string }[];
  description: { '@value': string }[];

  dateCreated: { '@value': string }[];
  dateModified: { '@value': string }[];
  dateWithdrawn: { '@value': string }[];

  creator: Creator[];
  hasVersion: MetadataField[];
  identifier: { '@value': string }[];
  publisher: MetadataField[];
  rights: MetadataField[];
  language: { '@value': string }[];
  statedConflictOfInterest: { '@value': string }[];
  resourceNature: ResourceNature[];
  isPartOfCollection: MetadataField[];
  storageByteCount: { '@value': string }[];
  storageRegion: { prefLabel: { '@value': string }[] }[];
  usage: Usage;
  hasOsfAddon: { prefLabel: { '@value': string }[] }[];
  funder: MetadataField[];
  affiliation: MetadataField[];
  qualifiedAttribution: QualifiedAttribution[];
  isPartOf: MetadataField[];
  isContainedBy: IsContainedBy[];
  conformsTo: MetadataField[];
  hasPreregisteredAnalysisPlan: { '@id': string }[];
  hasPreregisteredStudyDesign: { '@id': string }[];
  hasDataResource: MetadataField[];
  hasAnalyticCodeResource: MetadataField[];
  hasMaterialsResource: MetadataField[];
  hasPapersResource: MetadataField[];
  hasSupplementalResource: MetadataField[];
}

interface MetadataField {
  '@id': string;
  identifier: { '@value': string }[];
  name: { '@value': string }[];
  resourceType: { '@id': string }[];
  title: { '@value': string }[];
}

interface QualifiedAttribution {
  agent: { '@id': string }[];
  hadRole: { '@id': string }[];
  'osf:order': { '@value': string }[];
}

interface Usage {
  viewCount: { '@value': string }[];
  downloadCount: { '@value': string }[];
}

interface Creator extends MetadataField {
  affiliation: MetadataField[];
}

interface IriMatchEvidence {
  matchingIri: string;
  osfmapPropertyPath: string[];
  propertyPathKey: string;
  propertyPath: {
    displayLabel: {
      '@language': string;
      '@value': string;
    }[];
  }[];
}

interface TextMatchEvidence {
  matchingHighlight: string;
  osfmapPropertyPath: string[];
  propertyPathKey: string;
  propertyPath: {
    displayLabel: {
      '@language': string;
      '@value': string;
    }[];
  }[];
}

interface IsContainedBy extends MetadataField {
  funder: MetadataField[];
  creator: Creator[];
  rights: MetadataField[];
  qualifiedAttribution: QualifiedAttribution[];
}

interface ResourceNature {
  '@id': string;
  displayLabel: {
    '@language': string;
    '@value': string;
  }[];
}
