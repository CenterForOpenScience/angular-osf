import { SortOrder } from '../enums';

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
