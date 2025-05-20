export interface RelatedCountsGetResponse {
  data: RelatedCountsDataResponse;
  meta: MetaGetResponse;
}

export interface RelatedCountsModel {
  id: string;
  forksCount: number;
  linksToCount: number;
  templateCount: number;
  lastFetched?: number;
}

interface MetaGetResponse {
  templated_by_count: number;
}

interface RelatedCountsDataResponse {
  id: string;
  relationships: RelationshipsResponse;
}

interface RelationshipsResponse {
  forks: Relationship;
  linked_by_nodes: Relationship;
}

interface Relationship {
  links: Links;
}

interface Links {
  related: RelatedLink;
}

interface RelatedLink {
  meta: MetaCount;
}

interface MetaCount {
  count: number;
}
