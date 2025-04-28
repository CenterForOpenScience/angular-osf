export interface JsonApiResponse<Data, Included> {
  data: Data;
  included?: Included;
}

export interface ApiData<Attributes, Embeds, Relationships> {
  id: string;
  attributes: Attributes;
  embeds: Embeds;
  type: string;
  relationships: Relationships;
}
