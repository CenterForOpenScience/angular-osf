import { SortOrder } from '@shared/utils/sort-order.enum';

export type SearchField = 'tags' | 'title' | 'description';

export interface MyProjectsSearchFilters {
  searchValue?: string;
  searchFields?: SearchField[];
  sortColumn?: string;
  sortOrder?: SortOrder;
}
