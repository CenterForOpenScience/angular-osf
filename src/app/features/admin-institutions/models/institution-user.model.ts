export interface InstitutionUser {
  id: string;
  userName: string;
  department: string | null;
  orcidId: string | null;
  monthLastLogin: string;
  monthLastActive: string;
  accountCreationDate: string;
  publicProjects: number;
  privateProjects: number;
  publicRegistrationCount: number;
  embargoedRegistrationCount: number;
  publishedPreprintCount: number;
  publicFileCount: number;
  storageByteCount: number;
  contactsCount: number;
  userId: string;
  userLink: string;
}
