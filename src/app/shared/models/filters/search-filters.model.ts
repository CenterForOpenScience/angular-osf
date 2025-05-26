import { SortOrder } from '@shared/enums';

export interface SearchFilters {
  searchValue: string;
  searchFields: string[];
  sortColumn: string;
  sortOrder: SortOrder;
}
