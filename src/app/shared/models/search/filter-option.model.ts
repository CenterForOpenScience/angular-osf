export interface FilterOptionMetadata {
  '@id': string;
  name: { '@value': string }[];
  resourceType: { '@id': string }[];
  title?: { '@value': string }[];
}

export interface FilterOptionAttributes {
  resourceMetadata: FilterOptionMetadata;
}
