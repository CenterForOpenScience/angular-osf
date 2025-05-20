export interface AsyncStateModel<T> {
  data: T;
  isLoading: boolean;
  isSubmitting?: boolean;
  error: string | null;
}
