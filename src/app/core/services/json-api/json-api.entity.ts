export interface JsonApiResponse<T> {
  data: ApiData<T> | ApiData<T>[];
}

export interface ApiData<T> {
  id: string | number;
  attributes: T;
}
