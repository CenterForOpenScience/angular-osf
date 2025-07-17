export interface InstitutionPreprint {
  id: string;
  title: string;
  link: string;
  dateCreated: string;
  dateModified: string;
  doi?: string;
  license?: string;
  contributorName: string;
  viewsLast30Days?: number;
  downloadsLast30Days?: number;
  registrationSchema?: string;
}
