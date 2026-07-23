import { ToManyRelData } from '../common/json-api/relationships.model';
import { JsonApiResourceRef } from '../common/json-api/resource.model';
import { PaginationLinksModel } from '../pagination-links.model';

import { IndexCardSearchIncludedJsonApi } from './index-card-search-included-json-api.model';
import { IdNodeJsonApi } from './index-card-search-metadata-json-api.model';

export type {
  IndexCardDataJsonApi,
  IndexCardSearchIncludedJsonApi,
  RelatedPropertyPathDataJsonApi,
  SearchResultDataJsonApi,
} from './index-card-search-included-json-api.model';

export interface IndexCardSearchResponseJsonApi {
  data: IndexCardSearchDataJsonApi;
  included?: IndexCardSearchIncludedJsonApi[];
}

interface IndexCardSearchDataJsonApi {
  attributes: IndexCardSearchAttributesJsonApi;
  relationships: IndexCardSearchRelationshipsJsonApi;
}

interface IndexCardSearchAttributesJsonApi {
  totalResultCount: number | IdNodeJsonApi;
}

interface IndexCardSearchRelationshipsJsonApi {
  relatedProperties: ToManyRelData;
  searchResultPage: SearchResultPageJsonApi;
}

interface SearchResultPageJsonApi {
  data: JsonApiResourceRef[];
  links: PaginationLinksModel;
}
