import { SearchResultCount } from '@shared/components/resources/resource-filters/models/search-result-count.entity';
import { ResourceTypeIndexCardFilter } from '@shared/components/resources/resource-filters/models/resource-type/resource-type-index-card-filter.entity';

export type ResourceTypeIndexValueSearch =
  | SearchResultCount
  | ResourceTypeIndexCardFilter;
