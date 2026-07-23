export interface Embed<TResource> {
  data: TResource;
  errors?: unknown[];
}

export interface EmbedList<TResource> {
  data: TResource[];
  errors?: unknown[];
}
