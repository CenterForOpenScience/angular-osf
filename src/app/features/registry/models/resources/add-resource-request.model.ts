export interface AddResourceRequest<T> {
  attributes: T;
  id: string;
  relationships?: object;
  type: string;
}
