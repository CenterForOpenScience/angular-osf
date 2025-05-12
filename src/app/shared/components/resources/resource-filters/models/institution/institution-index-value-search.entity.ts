import { InstitutionIndexCardFilter } from '@shared/components/resources/resource-filters/models/institution/institution-index-card-filter.entity';
import { SearchResultCount } from '@shared/components/resources/resource-filters/models/search-result-count.entity';

export type InstitutionIndexValueSearch =
  | SearchResultCount
  | InstitutionIndexCardFilter;
