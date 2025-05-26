import { SortOrder } from '@shared/enums';
import { SearchFilters } from '@shared/models/filters';

export function searchPreferencesToJsonApiQueryParams(
  params: Record<string, unknown>,
  pageNumber?: number,
  pageSize?: number,
  filters?: SearchFilters,
  sortFieldMap?: Record<string, string>,
  defaultSort?: string
): Record<string, unknown> {
  if (filters?.searchValue && filters.searchFields.length) {
    params[`filter[${filters.searchFields.join(',')}]`] = filters.searchValue;
  }

  if (pageNumber) {
    params['page'] = pageNumber;
  }

  if (pageSize) {
    params['page[size]'] = pageSize;
  }

  if (filters && filters.sortColumn && sortFieldMap && sortFieldMap[filters.sortColumn]) {
    const apiField = sortFieldMap[filters.sortColumn];
    const sortPrefix = filters.sortOrder === SortOrder.Desc ? '-' : '';
    params['sort'] = `${sortPrefix}${apiField}`;
  } else if (defaultSort) {
    params['sort'] = defaultSort;
  }

  return params;
}
