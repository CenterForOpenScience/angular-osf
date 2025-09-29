import { Params } from '@angular/router';

import { SortOrder } from '@osf/shared/enums';
import { QueryParams } from '@osf/shared/models';

export const parseQueryFilterParams = (params: Params): QueryParams => {
  const page = parseInt(params['page'], 10) || 1;
  const size = parseInt(params['size'], 10) || 10;
  const search = params['search'] || '';
  const sortColumn = params['sortColumn'] || '';
  const sortOrder = params['sortOrder'] === 'asc' ? SortOrder.Asc : SortOrder.Desc;

  return {
    page,
    size,
    search,
    sortColumn,
    sortOrder,
  };
};
