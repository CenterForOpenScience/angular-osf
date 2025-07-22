import { SortOrder } from '@shared/enums';

export type SearchField = 'tags' | 'title' | 'description';

export interface MyResourcesSearchFilters {
  searchValue?: string;
  searchFields?: SearchField[];
  sortColumn?: string;
  sortOrder?: SortOrder;
}
