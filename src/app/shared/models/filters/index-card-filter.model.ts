export interface IndexCardFilter {
  attributes: {
    resourceIdentifier: string[];
    resourceMetadata: {
      displayLabel: { '@value': string }[];
      '@id': string;
    };
  };
  id: string;
  type: 'index-card';
}
