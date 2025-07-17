export interface InstitutionRegistration {
  id: string;
  title: string;
  link: string;
  dateCreated: string;
  dateModified: string;
  doi?: string;
  storageLocation: string;
  totalDataStored?: string;
  contributorName: string;
  views?: number;
  resourceType: string;
  license?: string;
  funderName?: string;
  registrationSchema?: string;
}
