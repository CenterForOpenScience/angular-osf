import { DiscoverableFilter, FilterOption } from './discoverable-filter.model';

export interface FilterOptionSelected {
  filter: DiscoverableFilter;
  filterOption: FilterOption[];
}
