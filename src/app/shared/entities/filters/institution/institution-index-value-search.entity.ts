import { InstitutionIndexCardFilter } from '@shared/entities/filters/institution/institution-index-card-filter.entity';
import { SearchResultCount } from '@shared/entities/filters/search-result-count.entity';

export type InstitutionIndexValueSearch = SearchResultCount | InstitutionIndexCardFilter;
