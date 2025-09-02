export interface RelatedCountsGetResponse {
  data: RelatedCountsDataResponse;
  meta: MetaGetResponse;
}

interface MetaGetResponse {
  templated_by_count: number;
}

interface RelatedCountsDataResponse {
  id: string;
  attributes: RelatedCountsAttributes;
  relationships: RelationshipsResponse;
}

interface RelatedCountsAttributes {
  public: boolean;
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
