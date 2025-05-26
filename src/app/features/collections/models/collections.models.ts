export interface CollectionAttributes {
  title: string;
  bookmarks: boolean;
}

export interface Collection {
  id: string;
  attributes: CollectionAttributes;
}

export interface SparseCollectionsResponse {
  data: Collection[];
}
