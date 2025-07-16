export interface InstitutionRegistrationsJsonApi {
  data: {
    id: string;
    type: 'index-card-search';
    attributes: {
      totalResultCount: number;
      cardSearchFilter: {
        filterType: { '@id': string };
        propertyPathKey: string;
        propertyPathSet: Record<string, unknown>[];
        filterValueSet: Record<string, unknown>[];
      }[];
    };
    relationships: {
      relatedProperties: {
        data: {
          id: string;
          type: 'related-property-path';
        }[];
      };
      searchResultPage: {
        data: {
          id: string;
          type: 'search-result';
        }[];
        links?: {
          first?: { href: string };
          next?: { href: string };
          prev?: { href: string };
          last?: { href: string };
        };
      };
    };
    links: {
      self: string;
    };
  };
  included: {
    id: string;
    type: 'related-property-path' | 'search-result' | 'index-card';
    attributes?: Record<string, unknown>;
    relationships?: Record<string, unknown>;
    links?: Record<string, unknown>;
  }[];
}
