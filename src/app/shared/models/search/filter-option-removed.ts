import { FilterOption } from './discoverable-filter.model';

export interface FilterOptionRemoved {
  filterKey: string;
  optionRemoved: FilterOption;
}
