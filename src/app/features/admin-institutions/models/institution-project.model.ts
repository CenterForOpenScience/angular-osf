export interface InstitutionProject {
  id: string;
  title: string;
  creator: string;
  dateCreated: string;
  dateModified: string;
  resourceType: string;
  accessService: string;
  publisher: string;
  identifier: string;
  storageByteCount?: number;
  storageRegion?: string;
  affiliation?: string[];
  description?: string;
  rights?: string;
  subject?: string;
  viewCount?: number;
  downloadCount?: number;
  hasVersion?: boolean;
  supplements?: boolean;
}
