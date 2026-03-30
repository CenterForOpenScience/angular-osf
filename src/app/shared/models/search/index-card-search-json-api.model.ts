import { ApiData, JsonApiResponse } from '../common/json-api.model';

export type IndexCardSearchResponseJsonApi = JsonApiResponse<
  {
    attributes: {
      totalResultCount: number | { '@id': string };
    };
    relationships: {
      searchResultPage: SearchResultPageJsonApi;
      relatedProperties: RelatedPropertiesJsonApi;
    };
    links: {
      self: string;
    };
  },
  (IndexCardDataJsonApi | RelatedPropertyPathDataJsonApi | SearchResultDataJsonApi)[]
>;

export type RelatedPropertyPathDataJsonApi = ApiData<RelatedPropertyPathAttributesJsonApi, null, null, null>;
export type IndexCardDataJsonApi = ApiData<IndexCardAttributesJsonApi, null, null, null>;

interface SearchResultPageJsonApi {
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
}

interface RelatedPropertiesJsonApi {
  data: { id: string }[];
}

export interface RelatedPropertyPathAttributesJsonApi {
  propertyPathKey: string;
  propertyPath: {
    '@id': string;
    displayLabel: {
      '@language': string;
      '@value': string;
    }[];
    description?: {
      '@language': string;
      '@value': string;
    }[];
    link?: {
      '@language': string;
      '@value': string;
    }[];
    linkText?: {
      '@language': string;
      '@value': string;
    }[];
    resourceType: {
      '@id': string;
    }[];
    shortFormLabel: {
      '@language': string;
      '@value': string;
    }[];
  }[];
  suggestedFilterOperator: string;
  cardSearchResultCount: number;
  osfmapPropertyPath: string[];
}

export interface SearchResultDataJsonApi {
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
