import { PaginationLinks } from './links.model';
import { ItemMetaJsonApi, ListMetaJsonApi } from './meta.model';

export interface DataResponse<TData> {
  data: TData;
}

export interface ItemResponse<TData, TMeta extends ItemMetaJsonApi = ItemMetaJsonApi> {
  data: TData;
  meta?: TMeta;
}

export interface ListResponse<TData, TMeta extends ListMetaJsonApi = ListMetaJsonApi> {
  data: TData[];
  meta: TMeta;
  links?: PaginationLinks;
}

export interface JsonApiResponse<Data, Included> {
  data: Data;
  included?: Included;
}
