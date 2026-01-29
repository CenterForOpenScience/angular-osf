export interface SearchUserDataModel<T> {
  users: T;
  totalCount: number;
  next: string | null;
  previous: string | null;
}
