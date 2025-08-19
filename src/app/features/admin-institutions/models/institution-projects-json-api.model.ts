export interface IncludedItem {
  id: string;
  type: 'related-property-path' | 'search-result' | 'index-card';
  attributes?: Record<string, unknown>;
  relationships?: Record<string, unknown>;
  links?: Record<string, unknown>;
}

export interface SearchResult extends IncludedItem {
  type: 'search-result';
  relationships?: {
    indexCard?: {
      data?: {
        id: string;
      };
    };
  };
}

export interface IndexCard extends IncludedItem {
  type: 'index-card';
  attributes?: {
    resourceMetadata?: ResourceMetadata;
  };
}

export interface ResourceMetadata {
  '@id'?: string;
  title?: { '@value': string }[];
  creator?: { '@id': string; name?: { '@value': string }[] }[];
  dateCreated?: { '@value': string }[];
  dateModified?: { '@value': string }[];
  resourceType?: { '@id': string }[];
  accessService?: { '@id': string }[];
  publisher?: { name?: { '@value': string }[] }[];
  identifier?: { '@value': string }[];
  storageByteCount?: { '@value': string }[];
  storageRegion?: { prefLabel?: { '@value': string }[] }[];
  affiliation?: { name?: { '@value': string }[] }[];
  description?: { '@value': string }[];
  rights?: { name?: { '@value': string }[] }[];
  subject?: { prefLabel?: { '@value': string }[] }[];
  usage?: { viewCount?: { '@value': string }[]; downloadCount?: { '@value': string }[] }[];
  hasVersion?: unknown[];
  supplements?: unknown[];
}

export interface Affiliation {
  name?: { '@value': string }[];
}
