export interface JsonApiResponse<Data, Included> {
  data: Data;
  included?: Included;
}

export interface ApiData<Attributes, Embeds> {
  id: string;
  attributes: Attributes;
  embeds: Embeds;
}
