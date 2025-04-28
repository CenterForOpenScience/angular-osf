import { SearchResultCount } from '@shared/components/resources/resource-filters/models/search-result-count.entity';
import { ProviderIndexCardFilter } from '@shared/components/resources/resource-filters/models/provider/provider-index-card-filter.entity';

export type ProviderIndexValueSearch =
  | SearchResultCount
  | ProviderIndexCardFilter;
