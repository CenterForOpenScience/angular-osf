export interface SearchResultCount {
  attributes: {
    cardSearchResultCount: number;
  };
  id: string;
  type: 'search-result';
  relationships: {
    indexCard: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}
