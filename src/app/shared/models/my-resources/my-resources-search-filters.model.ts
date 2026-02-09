import { SortOrder } from '@shared/enums/sort-order.enum';

export type SearchField = 'tags' | 'title' | 'description';

export interface MyResourcesSearchFilters {
  searchValue?: string;
  searchFields?: SearchField[];
  sortColumn?: string;
  sortOrder?: SortOrder;
}
