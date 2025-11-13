import { SortOrder } from '../enums/sort-order.enum';

export interface SearchFilters {
  searchValue: string;
  searchFields: string[];
  sortColumn: string;
  sortOrder: SortOrder;
}
