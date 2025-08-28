export interface JsonApiResponse<Data, Included> {
  data: Data;
  included?: Included;
}

export interface JsonApiResponseWithMeta<Data, Meta, Included> extends JsonApiResponse<Data, Included> {
  meta: Meta;
}

export interface ResponseJsonApi<Data> {
  data: Data;
  links: PaginationLinksJsonApi;
  meta: MetaJsonApi;
}

export interface ResponseDataJsonApi<Data> {
  data: Data;
  meta: MetaJsonApi;
}

export interface ApiData<Attributes, Embeds, Relationships, Links> {
  id: string;
  attributes: Attributes;
  embeds: Embeds;
  type: string;
  relationships: Relationships;
  links: Links;
}

export interface MetaJsonApi {
  total: number;
  per_page: number;
  version: string;
}

export interface PaginationLinksJsonApi {
  self?: string;
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
}
