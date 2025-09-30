import { Injectable } from '@angular/core';

import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants';
import { TableParameters } from '@osf/shared/models';

@Injectable({ providedIn: 'root' })
export class MyProjectsTableParamsService {
  buildTableParams(baseRows: number, totalRecords: number, isBookmarks: boolean): TableParameters {
    if (isBookmarks) {
      return {
        ...DEFAULT_TABLE_PARAMS,
        paginator: false,
        rows: totalRecords,
        rowsPerPageOptions: [],
        totalRecords,
        firstRowIndex: 0,
      };
    }

    return {
      ...DEFAULT_TABLE_PARAMS,
      paginator: true,
      rows: baseRows,
      totalRecords,
      firstRowIndex: 0,
    };
  }
}
