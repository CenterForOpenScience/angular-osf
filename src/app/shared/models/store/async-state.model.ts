export interface AsyncStateModel<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
}
