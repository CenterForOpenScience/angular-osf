import { Params } from '@angular/router';

import { QueryParams } from '@shared/entities/query-params.interface';
import { SortOrder } from '@shared/utils/sort-order.enum';

export const parseQueryFilterParams = (params: Params): QueryParams => {
  const page = parseInt(params['page'], 10) || 1;
  const size = parseInt(params['size'], 10) || 10;
  const search = params['search'] || '';
  const sortColumn = params['sortColumn'] || '';
  const sortOrder = params['sortOrder'] === 'desc' ? SortOrder.Desc : SortOrder.Asc;

  return {
    page,
    size,
    search,
    sortColumn,
    sortOrder,
  };
};
