export interface CollectionProvider {
  id: string;
  type: string;
  name: string;
  description: string;
  advisoryBoard: string;
  example: string | null;
  domain: string;
  domainRedirectEnabled: boolean;
  footerLinks: string;
  emailSupport: boolean | null;
  facebookAppId: string | null;
  allowSubmissions: boolean;
  allowCommenting: boolean;
  assets: {
    style?: string;
    squareColorTransparent?: string;
    squareColorNoTransparent?: string;
    favicon?: string;
  };
  shareSource: string;
  sharePublishType: string;
  permissions: string[];
  reviewsWorkflow: string;
  primaryCollection: {
    id: string;
    type: string;
  };
}

export interface CollectionFilters {
  status: string[];
  collectedType: string[];
  volume: string[];
  issue: string[];
  programArea: string[];
  schoolType: string[];
  studyDesign: string[];
  dataType: string[];
  disease: string[];
  gradeLevels: string[];
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
}

export interface CollectionContributor {
  id: string;
  name: string;
  url: string;
}

export interface CollectionSubmission {
  id: string;
  type: string;
  nodeId: string;
  nodeUrl: string;
  title: string;
  description: string;
  category: string;
  dateCreated: string;
  dateModified: string;
  public: boolean;
  reviewsState: string;
  collectedType: string;
  status: string;
  volume: string;
  issue: string;
  programArea: string;
  schoolType: string;
  studyDesign: string;
  dataType: string;
  disease: string;
  gradeLevels: string;
  contributors?: CollectionContributor[];
}
