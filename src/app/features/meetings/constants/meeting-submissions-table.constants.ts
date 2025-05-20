import { TableParameters } from '@shared/entities/table-parameters.interface';

export const MEETING_SUBMISSIONS_TABLE_PARAMS: TableParameters = {
  rows: 10,
  paginator: true,
  scrollable: false,
  rowsPerPageOptions: [5, 10, 25],
  totalRecords: 3,
  firstRowIndex: 0,
  defaultSortColumn: null,
  defaultSortOrder: null,
};
