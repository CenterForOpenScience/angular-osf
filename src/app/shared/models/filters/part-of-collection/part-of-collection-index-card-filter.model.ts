export interface PartOfCollectionIndexCardFilter {
  attributes: {
    resourceIdentifier: string[];
    resourceMetadata: {
      title: { '@value': string }[];
      '@id': string;
    };
  };
  id: string;
  type: 'index-card';
}
