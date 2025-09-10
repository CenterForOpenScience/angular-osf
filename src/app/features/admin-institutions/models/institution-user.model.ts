export interface InstitutionUser {
  id: string;
  userId: string;
  userName: string;
  department: string | null;
  orcidId: string | null;
  publicProjects: number;
  privateProjects: number;
  publicRegistrationCount: number;
  embargoedRegistrationCount: number;
  publishedPreprintCount: number;
}
