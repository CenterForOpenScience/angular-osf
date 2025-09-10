import { TableParameters } from '../models';

export const MY_PROJECTS_TABLE_PARAMS: TableParameters = {
  rows: 10,
  paginator: true,
  scrollable: false,
  rowsPerPageOptions: [5, 10, 25],
  totalRecords: 0,
  firstRowIndex: 0,
  defaultSortColumn: null,
  defaultSortOrder: null,
};
