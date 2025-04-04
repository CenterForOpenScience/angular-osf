export interface JsonApiResponse<T> {
  data: T;
}

export interface JsonApiArrayResponse<T> {
  data: T[];
}

export interface ApiData<Attributes, Embeds> {
  id: string;
  attributes: Attributes;
  embeds: Embeds;
}
