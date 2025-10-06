export interface PaginatedData<T> {
  data: T;
  totalCount: number;
  pageSize: number;
  isAnonymous?: boolean;
}
