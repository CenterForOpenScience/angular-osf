import { Params } from '@angular/router';

import { SortOrder } from '@shared/utils/sort-order.enum';

export const parseQueryFilterParams = (
  params: Params,
): {
  page: number;
  size: number;
  search: string;
  sortColumn: string;
  sortOrder: SortOrder;
} => {
  const page = parseInt(params['page'], 10) || 1;
  const size = parseInt(params['size'], 10);
  const search = params['search'];
  const sortColumn = params['sortColumn'];
  const sortOrder =
    params['sortOrder'] === 'desc' ? SortOrder.Desc : SortOrder.Asc;

  return {
    page,
    size,
    search,
    sortColumn,
    sortOrder,
  };
};
