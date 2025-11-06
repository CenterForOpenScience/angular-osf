import { SortOrder } from '@shared/enums/sort-order.enum';

export interface QueryParams {
  page: number;
  size: number;
  search: string;
  sortColumn: string;
  sortOrder: SortOrder;
}
