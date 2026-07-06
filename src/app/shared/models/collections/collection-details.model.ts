export interface CollectionFilters {
  collectedType: string[];
  disease: string[];
  dataType: string[];
  gradeLevels: string[];
  issue: string[];
  programArea: string[];
  schoolType: string[];
  status: string[];
  studyDesign: string[];
  volume: string[];
}

export interface CollectionDetails {
  id: string;
  type: string;
  title: string;
  dateCreated: string;
  dateModified: string;
  bookmarks: boolean;
  isPromoted: boolean;
  isPublic: boolean;
  filters: CollectionFilters;
  iri?: string;
}
