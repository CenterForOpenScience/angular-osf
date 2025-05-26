import { SortOrder } from '@osf/shared/enums/sort-order.enum';

export interface TableParameters {
  rows: number;
  paginator: boolean;
  scrollable: boolean;
  rowsPerPageOptions: number[];
  totalRecords: number;
  firstRowIndex: number;
  defaultSortOrder?: SortOrder | null;
  defaultSortColumn?: string | null;
}
