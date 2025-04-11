export interface JsonApiResponse<T> {
  data: T;
  included?: T[];
}

export interface JsonApiArrayResponse<T> {
  data: T[];
  included?: T[];
}

export interface IncludedData {
  type: string;
  id: string;
  attributes: Record<string, unknown>;
  relationships?: Record<
    string,
    {
      links: {
        related: string;
      };
      data?: {
        type: string;
        id: string;
      };
    }
  >;
  links?: {
    self: string;
  };
}

export interface ApiData<Attributes, Embeds> {
  id: string;
  attributes: Attributes;
  embeds: Embeds;
}
