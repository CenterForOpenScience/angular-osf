export interface FunderIndexCardFilter {
  attributes: {
    resourceIdentifier: string[];
    resourceMetadata: {
      name: { '@value': string }[];
      '@id': string;
    };
  };
  id: string;
  type: 'index-card';
}
