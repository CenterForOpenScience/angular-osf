import { SortOrder } from '@osf/shared/enums';

export type SearchField = 'tags' | 'title' | 'description';

export interface MyProjectsSearchFilters {
  searchValue?: string;
  searchFields?: SearchField[];
  sortColumn?: string;
  sortOrder?: SortOrder;
}
