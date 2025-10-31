import { TableParameters } from '../models/table-parameters.model';

export const DEFAULT_TABLE_PARAMS: TableParameters = {
  rows: 10,
  paginator: true,
  scrollable: true,
  rowsPerPageOptions: [5, 10, 25],
  totalRecords: 3,
  firstRowIndex: 0,
  defaultSortColumn: null,
  defaultSortOrder: null,
};
