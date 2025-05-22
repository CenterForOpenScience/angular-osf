import { SortOrder } from '@shared/utils/sort-order.enum';

export interface SearchFilters {
  searchValue: string;
  searchFields: string[];
  sortColumn: string;
  sortOrder: SortOrder;
}
