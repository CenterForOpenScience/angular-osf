export interface CollectionDetails {
  id: string;
  type: string;
  title: string;
  dateCreated: string;
  dateModified: string;
  bookmarks: boolean;
  isPromoted: boolean;
  isPublic: boolean;
  iri?: string;
}
