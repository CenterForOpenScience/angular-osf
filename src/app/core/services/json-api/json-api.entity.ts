export interface JsonApiResponse<Data, Included> {
  data: Data;
  included?: Included;
}

export interface JsonApiResponseWithPaging<Data, Included> extends JsonApiResponse<Data, Included> {
  links: {
    meta: {
      total: number;
      per_page: number;
    };
  };
}

export interface ApiData<Attributes, Embeds, Relationships> {
  id: string;
  attributes: Attributes;
  embeds: Embeds;
  type: string;
  relationships: Relationships;
}
