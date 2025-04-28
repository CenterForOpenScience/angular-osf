import { SearchResultCount } from '@shared/components/resources/resource-filters/models/search-result-count.entity';
import { LicenseIndexCardFilter } from '@shared/components/resources/resource-filters/models/license/license-index-card-filter.entity';

export type LicenseIndexValueSearch =
  | SearchResultCount
  | LicenseIndexCardFilter;
