export interface JsonApiResourceRef<TType extends string = string> {
  id: string;
  type: TType;
}

export interface JsonApiResource<TType extends string, TAttributes = Record<string, never>> {
  id: string;
  type: TType;
  attributes: TAttributes;
}
