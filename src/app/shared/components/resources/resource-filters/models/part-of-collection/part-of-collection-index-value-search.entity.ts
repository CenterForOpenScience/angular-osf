import { SearchResultCount } from '@shared/components/resources/resource-filters/models/search-result-count.entity';
import { PartOfCollectionIndexCardFilter } from '@shared/components/resources/resource-filters/models/part-of-collection/part-of-collection-index-card-filter.entity';

export type PartOfCollectionIndexValueSearch =
  | SearchResultCount
  | PartOfCollectionIndexCardFilter;
