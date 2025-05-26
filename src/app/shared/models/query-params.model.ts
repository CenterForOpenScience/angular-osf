import { SortOrder } from '@shared/enums';

export interface QueryParams {
  page: number;
  size: number;
  search: string;
  sortColumn: string;
  sortOrder: SortOrder;
}
