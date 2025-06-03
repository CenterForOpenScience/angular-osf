export interface CollectionSearchResultCard {
  id: string;
  title: string;
  description?: string;
  dateCreated: Date;
  dateModified: Date;
  category: string;
  contributors: Contributor[];
  programArea: string;
  collectedType: string;
  dataType: string;
  disease: string;
  gradeLevels: string;
  issue: string;
  reviewsState: string;
  schoolType: string;
  status: string;
  studyDesign: string;
  volume: string;
}

interface Contributor {
  id: string;
  name: string;
}
